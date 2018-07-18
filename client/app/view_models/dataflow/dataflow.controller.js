import angular from 'angular';
import uuid from 'uuid';

/*@ngInject*/
class Controller {
  constructor($element, $rootScope, $scope, $attrs, $state, $log, jsPlumbService, DatasetStorageService, DataflowAPIMock, PipelineService, PipelineAPI, ContextMenuService, ngDialog) {
    console.log('new dataflow controller object');

    let vm = this;

    this.$element = $element;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$attrs = $attrs;
    this.$log = $log;
    this.jsPlumbService = jsPlumbService;
    this.DatasetStorageService = DatasetStorageService;
    this.DataflowAPIMock = DataflowAPIMock;
    this.PipelineAPI = PipelineAPI;
    this.PipelineService = PipelineService;
    this.ContextMenuService = ContextMenuService;
    this.ngDialog = ngDialog;
    this.$state = $state;

    this.ContextMenuService.once('CLOSE_CONTEXT_MENU', () => {
      this.$scope.$destroy();
    });

    this.PipelineAPI.getListEx().then((res) => {
      this.pipelines = res.pipelineMetadatas;
      if(PipelineService.isActive() && !PipelineService.isPipelineSaved()) {
        this.pipelines.push({
          name: '[WIP] ' + PipelineService.getPipelineName(),
          uuid: PipelineService.getPipelineUUID()
        });
        this.selectedPipeline = PipelineService.getPipelineUUID();
      }
      else if (PipelineService.getPipelineUUID()) {
        this.selectedPipeline = PipelineService.getPipelineUUID();
      } else if (this.pipelines && this.pipelines.length > 0) {
        this.selectedPipeline = this.pipelines[0].id;
      }
    });

    let telliscript = angular.element(document.querySelector('.ly-telliscript'));
    telliscript.addClass('disabled');

    this.nodeTypesGroups = DataflowAPIMock.getNodeTypesGroups();
    this.nodeTypes = DataflowAPIMock.getNodeTypes();

    let toolkit = jsPlumbService.getToolkit('flowchartToolkit');
    let surface = jsPlumbService.getSurface('flowchartSurface');

    this.typeExtractor = function typeExtrac(el) {
      return el.getAttribute('jtk-node-type');
    };
    this.dropDataGenerator = function dropDataGen(type, el) {
      return {
        text: el.getAttribute('jtk-node-name'),
        id: uuid.v4(),
        tasks: '0',
        type: type,
      };
    };

    this.init = function init(scope, element) {
      toolkit = scope.toolkit;
      surface = scope.surface;

      toolkit.clear();
      toolkit.load({
        data: PipelineService.dataflowize(),
        onload: () => {
          surface.setZoom(surface.getZoom() - 10);
          surface.centerContent();
        }
      });

      toolkit.bind('dataUpdated', function() {
        PipelineService.onPipelineUpdate(toolkit.exportData());
      });

      toolkit.bind('nodeAdded', (newNode) => {
        // console.log('node added');
        console.log(newNode);
      });

      // buttons
      let controls = element[0].querySelector('.jtk-controls');
      jsPlumb.on(controls, 'tap', '[zoom-to-fit]', function tapZoomToFit() {
        toolkit.clearSelection();
        surface.zoomToFit();
      });
      jsPlumb.on(controls, 'tap', '[zoom-to-center]', function tapZoomToCenter() {
        surface.centerContent();
      });
      jsPlumb.on(controls, 'tap', '[zoom-in]', function tapZoomIn() {
        toolkit.clearSelection();
        surface.nudgeZoom(0.15);
      });
      jsPlumb.on(controls, 'tap', '[zoom-out]', function tapZoomOut() {
        toolkit.clearSelection();
        surface.nudgeZoom(-0.15);
      });

      // initialize dialogs
      jsPlumbToolkit.Dialogs.initialize({
        selector: '.dlg',
      });

    };
    this.renderParams = {
      view: {
        nodes: {
          'default': {
            template: 'default',
            events: {
              'dblclick': function dblclick(params) {
                jsPlumbToolkit.Dialogs.show({
                  id: 'dlgText',
                  data: {
                    text: params.node.data.text,
                  },
                  title: 'Edit ' + params.node.data.type + ' text',
                  onOK: function onOK(data) {
                    toolkit.updateNode(params.node, data);
                  },
                });
              },
            },
          },
        },
        edges: {
          'default': {
            connector: ['Flowchart', {stub: 15, midpoint: 0.75, cornerRadius: 5}],
            paintStyle: {
              lineWidth: 2,
              strokeStyle: '#cfd8dc',
              outlineColor: 'transparent',
              outlineWidth: 4,
            },
            hoverPaintStyle: {
              lineWidth: 2,
              strokeStyle: '#78909c',
              outlineColor: 'transparent',
              outlineWidth: 4,
            },
            events: {
              'dblclick': function dblclick(params) {
                jsPlumbToolkit.Dialogs.show({
                  id: 'dlgConfirm',
                  data: {
                    msg: 'Swap connection direction',
                  },
                  onOK: function onOK() {
                    toolkit.removeEdge(params.edge);
                    toolkit.connect({
                      source: params.edge.target.id,
                      target: params.edge.source.id,
                    });
                  },
                });
              },
              'mouseover': function mouseover(params) {
                params.connection.getOverlay('swapLabel').show();
              },
              'mouseout': function mouseout(params) {
                params.connection.getOverlay('swapLabel').hide();
              },
            },
            overlays: [
              ['Diamond', {location: 8, width: 12, length: 12}],
              ['Arrow', {location: 1, width: 14, length: 14}],
              ['Label', {
                cssClass: 'edge-swap-connection',
                label: '<i class="icon-swap" title="Swap connection direction"></i>',
                events: {
                  'click': function click(params) {
                    jsPlumbToolkit.Dialogs.show({
                      id: 'dlgConfirm',
                      data: {
                        msg: 'Swap connection direction',
                      },
                      onOK: function onOK() {
                        toolkit.removeEdge(params.edge);
                        toolkit.connect({
                          source: params.edge.target.id,
                          target: params.edge.source.id,
                        });
                      },
                    });
                  },
                },
                location: 0.5,
                id: 'swapLabel',
              }],
            ],
          },
        },
        ports: {
          'target': {
            anchor: ['Continuous', {faces: ['top']}],
            maxConnections: -1,
            uniqueEndpoint: true,
          },
          'source': {
            anchor: ['Continuous', {faces: ['bottom']}],
            maxConnections: -1,
            uniqueEndpoint: true,
          },
        },
      },
      layout: {
        type: 'Hierarchical',
        parameters: {
          padding: [340, 150],
        },
      },
      events: {
        canvasClick: function canvasClick() {
          toolkit.clearSelection();
        },
      },
      jsPlumb: {
        DoNotThrowErrors: true,
        Endpoints: [['Dot', {radius: 10}], ['Dot', {radius: 10}]],
        EndpointStyle: {fillStyle: 'transparent'},
      },
      elementsDroppable: true,
      consumeRightClick: false,
      zoomToFit: true,
    };
    $scope.deleteNode = function deleteNode(node) {
      console.log(node);
      let info = this.surface.getObjectInfo(node);
      console.log(info);
      if (info.obj.type === 'load') {
        jsPlumbToolkit.Dialogs.show({
          id: 'dlgMessage',
          title: 'Invalid operation!',
          data: {
            msg: 'You can not delete the root load stage!'
          }
        });
      } else {
        jsPlumbToolkit.Dialogs.show({
          id: 'dlgConfirm',
          title: 'Are you sure you want to delete ?',
          data: {
            msg: info.obj.text,
          },
          onOK: function onOK() {
            toolkit.removeNode(info.obj);
            PipelineService.deleteStage(info.obj.id);
            let zoomLevel = surface.getZoom();
            toolkit.clear();
            toolkit.load({
              type: 'json',
              data: PipelineService.dataflowize(),
            });
          },
        });
      }
    };
    $scope.exploreNode = function exploreNode(node) {
      let info = this.surface.getObjectInfo(node);
      console.log('$scope.exploreNode : ', node, info);
      if(node.type === 'transform') {
        $state.go('app.transform.grid');
      }
    };
    $scope.editNodeText = function editNodeText(node) {
      let info = this.surface.getObjectInfo(node);
      jsPlumbToolkit.Dialogs.show({
        id: 'dlgText',
        data: info.obj,
        title: 'Edit ' + info.obj.type + ' text',
        onOK: function onOK(data) {
          if (data.text && data.text.length > 0) {
            //PipelineService.setStageName(info.obj.id, data.text);
            toolkit.updateNode(info.obj, data);
          }
        },
      });
    };
  }

  onChangePipeline() {
    console.log('onChangePipeline: ' + this.selectedPipeline);
    if(this.selectedPipeline) {
      this.jsPlumbService.getToolkit('flowchartToolkit').clear();
      this.PipelineAPI.load(this.selectedPipeline).then((res) => {
        this.PipelineService.inflatePipeline(res);
        this.jsPlumbService.getToolkit('flowchartToolkit').load({
          data: this.PipelineService.dataflowize(),
          onload: () => {
            this.jsPlumbService.getSurface('flowchartSurface').setZoom(this.jsPlumbService.getSurface('flowchartSurface').getZoom() - 10);
            this.jsPlumbService.getSurface('flowchartSurface').centerContent();
          }
        });
      });
    }
  }

  saveDataFlow() {
    this.PipelineService.savePipeline();
  }

  executeDataFlow() {
    console.log('executeDataFlow');
  }

  newDataFlow() {
    console.log('newDataFlow');
  }

  deleteItem() {
    console.log('dataflow.controller: trying to delete: ' + this.selectedPipeline);
    this.PipelineService.deletePipeline(this.selectedPipeline).then((res) => {
      this.PipelineAPI.getListEx().then((res) => {
        this.pipelines = res.pipelineMetadatas;
      }).then(() => {
        this.jsPlumbService.getToolkit('flowchartToolkit').clear();
      });
    });
  }
}


export default Controller;
