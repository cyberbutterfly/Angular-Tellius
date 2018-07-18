import angular from 'angular';

import WrapperModule from './wrapper'

describe('Api wrapper', () => {
  let provider,
      ApiWrapper,
      $httpBackend;

  beforeEach(() => {
    angular.module('app', [])
      .config(function (ApiWrapperProvider) {
        provider = ApiWrapperProvider;
      });

    window.module('Tellius.api.wrapper', 'app');

    inject((_$httpBackend_, _ApiWrapper_) => {
      $httpBackend = _$httpBackend_;
      ApiWrapper   = _ApiWrapper_;
    });

  });

  it('setBaseUrl', () => {
    expect(provider.setBaseUrl('/api')).to.equal('/api');
  });

  describe('GET method', () => {

    beforeEach(() => {
      $httpBackend
        .expectGET('/data')
        .respond(200, {foo: 'xyz'});

      ApiWrapper.get('/data');

      $httpBackend.flush();

    });

    it('request', () => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('POST method', () => {
    const chunk = {foo: 'bar'};

    beforeEach(() => {
      $httpBackend
        .when('POST', '/post', (data)=> {
          expect(data).to.be.equal(JSON.stringify(chunk));
          return true;
        })
        .respond(200, true);
    });

    it('request', () => {
      ApiWrapper.post('/post', chunk).then((res)=> {
        expect(res).to.be.equal(true);
      });
      $httpBackend.flush();
    });

  });

  describe('PUT method', () => {
    const chunk = {foo: 'bar'};

    beforeEach(() => {
      $httpBackend
        .when('PUT', '/put', (data) => {
          expect(data).to.be.equal(JSON.stringify(chunk));
          return true;
        })
        .respond(200, true);
    });

    it('request', () => {
      ApiWrapper
        .put('/put', chunk)
        .then((res) => {
          expect(res).to.be.equal(true);
        });

    });

    afterEach(() => {
      $httpBackend.flush();
    });

  });

  describe('DELETE method', () => {

    beforeEach(() => {
      $httpBackend
        .expectDELETE('/delete')
        .respond(200, true);
    });

    it('request', () => {
      ApiWrapper.delete('/delete')
        .then((res) => {
          expect(res).to.be.equal(true);
        });
    });

    afterEach(() => {
      $httpBackend.flush();
    });

  });

});