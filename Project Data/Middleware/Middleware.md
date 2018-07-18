### Changelog

#### Version 5.5.1

[Insights API](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#insights-api) added.
Viz objects have a new optional `String` property: `insightsLabel`:

```bash
curl -v -X PUT -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJ...kQ' \
  http://52.87.228.68:8080/viz/57026213c2463049a5904dc2 \
  --data '{"insightsLabel": "some label for insights"}'
```

```json
{
  "updatedAt": "2016-07-14T21:08:33.888Z",
  "yAxis": {
    "column": "arrdelay",
    "aggregation": "avg"
  },
  "colorPaletteDataColors": {
    "id": "56d6b3e0c246301416f1ea09",
    "colors": ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
    "createdAt": "2016-03-02T09:35:28.349Z"
  },
  "timeRange": {
    "type": "all",
    "filterColumn": "time"
  },
  "insightsLabel": "some label for insights",
  "thumbnail": "57067c09c2463049a5904e05",
  "id": "57026213c2463049a5904dc2",
  "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
  "filters": [],
  "createdAt": "2016-04-04T12:46:11.784Z",
  "owner": {
    "username": "superUser",
    "email": "another2@gmail.com",
    "groups": [{
      "name": "SuperUsers",
      "permissions": [],
      "id": "5675959437bab64e38c7b8fa",
      "createdAt": "2016-01-15T16:44:03.809Z"
    }],
    "id": "567595de37bab64e38c7b8fb"
  },
  "title": "line chart between avg @arrdelay and @dest",
  "type": "line",
  "xAxis": {
    "column": "dest",
    "resolution": "weekly"
  }
}
```

#### Version 5.1.4

Added additional optional fields to Viz objects: `additionalMeasures`, `additionalDimensions`, `mapData`.

Example usage:

```bash
curl -v -X PUT -H "Content-Type: application/json"\
  -H 'Authorization: Bearer eyJhbGc...f659a9a --data '{
    "additionalMeasures": [{"column": "foo", "aggregation": "sum"}], 
    "additionalDimensions": [{"column": "bar", "resolution": "monthly"}], 
    "mapData": {"latitude": "latitudeCol", "longitude": "longitudeCol", "mapColor": "#334455", "mapSize": "large"}
  }'
```

```json
{
  "updatedAt": "2016-06-10T19:44:13.761Z",
  "yAxis": {
    "column": "Distance",
    "aggregation": "avg"
  },
  "additionalDimensions": [{
    "column": "bar",
    "resolution": "monthly"
  }],
  "colorPaletteDataColors": {
    "id": "56d6b295c246301416f1ea07",
    "colors": ["#26C6DA", "#5C6BC0", "#F65161", "#FFB810", "#36C398", "#0097A7"],
    "createdAt": "2016-03-02T09:29:57.932Z"
  },
  "additionalMeasures": [{
    "column": "foo",
    "aggregation": "sum"
  }],
  "timeRange": {
    "type": "all",
    "filterColumn": "time"
  },
  "thumbnail": "570e7933c2463049a5904eed",
  "id": "56e40464c24630146f659a9a",
  "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
  "filters": [],
  "createdAt": "2016-03-12T11:58:28.310Z",
  "owner": {
    "username": "superUser",
    "email": "another2@gmail.com",
    "groups": [{
      "name": "SuperUsers",
      "permissions": [],
      "id": "5675959437bab64e38c7b8fa",
      "createdAt": "2016-01-15T16:44:03.809Z"
    }],
    "id": "567595de37bab64e38c7b8fb"
  },
  "title": "testGidster",
  "type": "line",
  "xAxis": {
    "column": "UniqueCarrier",
    "resolution": "weekly"
  },
  "mapData": {
    "latitude": "latitudeCol",
    "longitude": "longitudeCol",
    "mapColor": "#334455",
    "mapSize": "large"
  }
}
```

#### Version 5.0.0

Changes:

- we don't use "check" anymore on RestHandler generated methods
- we pass isAdmin in JWT token (all tokens should be updated!), admin logic added
- AuthHelpers and HandlerHelpers added and code for authorization for all methods checked & refactored
- New users, groups and dataset descriptions behavior for admins
- owner field in all create params is now optional, if not provided, owner will be assigned automatically
- added owner field to dataset attributes, the behavior is the same as in the other objects

[Diff](https://github.com/Tellius/SmartQueryEngine/compare/a29c48838193427f6540b83dad0a82f4b6005572...63736457c87f7f740af261e979031f8ff9f6ab3f)

#### Version 4.0.1
  - Users, Groups, and Dataset Descriptions changed to accommodate for new authorization logic. 
  
New fields has been added to User objects to introduce Admin users (they can be set only by superUser):
- `isAdmin`: optional Boolean
- `groupsUnderAdministration`: optional list of groups that are under administration of this user (will work only if 
`isAdmin` is true)
- `usersUnderAdministration`: optional list of users that are under administration of this user (will work only if 
`isAdmin` is true)

For both Users and Groups a `datasetAccesses` field were added. It contains a list of objects like this one:

```json
{
  "datasetId": "airlines", 
  "readOnly": true
}
```

Dataset Descriptions now have an `owner` field.

`datasetAccesses` fields are used in a new Dataset Descriptions list logic. Previously, only superUsers were able
to access this view. Now any user can do that, but:
 
  - If user is a superUser, he will get all available datasets in the response
  - If user is a regular user or an Admin, he will get all the datasets that he has created, and all the datasets 
  specified in his `datasetAccesses` list + datasets specified in `datasetAccesses` lists of all his groups.


Response format of Dataset Descriptions list API has been changed, instead of list of datasets it now returns a list of 
objects in this format:

```json
{
  "datasetDescription": {
    "hierarchies": [],
    "datasetId": "trip_data_test",
    "id": "572e3fcf43c3531daced3d80",
    "columns": [{
      "name": "id",
      "type": "measure"
      },
      ...
    ],
    "createdAt": "2016-05-07T19:19:43.183Z",
    "owner": {
      "username": "superUser",
      "email": "another2@gmail.com",
      "groups": [{
        "name": "SuperUsers",
        "permissions": [],
        "id": "5675959437bab64e38c7b8fa",
        "createdAt": "2016-01-15T16:44:03.809Z"
      }],
      "id": "567595de37bab64e38c7b8fb"
    }
  },
  "readOnly": false
 }
  ```

#### Version 3.0.0
  - Chaned `sharedWith` field format in `VizPad` objects. Instead of list of users to share VizPad with it now 
  accepts a list of objects, consisting of `userId` and `permission` (either `"read"` or `"write"`). Example: 
  
  ```bash
  curl -v -X PUT -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJhbGciOi9abd --data '{
      "sharedWith": [{"userId": "567595de37bab64e38c7b8fb", "permission": "write"}]
   }'
  ```
  
  `sharedWith` in VizPads in responses:
  
  ```json
  {
    "sharedWith": [{
      "user": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "permission": "write"
    }],
    ...
  }
  ```

#### Version 2.0.0
  - Added [AppData API](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#appsdata-api)

#### Version 1.13.4
  - Added [Apps API](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#apps-api).

#### Version 1.12.0
  - Added list method to Dataset Descriptions API. Please, refer to 
  [the docs](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#dataset-description-api-methods).

#### Version 1.11.0
  - Fixed logic for dataset groups finder in Cluster Interface

#### Version 1.10.0
  - Added a CLI option to specify seed nodes for the cluster. Example usage: 
  `java -jar tellius_middleware-assembly-1.10.0.jar -s '"akka.tcp://sqe-cluster@192.168.1.51:2551"'`

#### Version 1.9.0
  - Added cluster interface to Dataset Groups API.

#### Version 1.8.8
  - Additional validations for Dataset Groups API methods.

#### Version 1.8.7
  - Added additional method to Dataset Groups API: find by datasets ids. Check out new method 
  [here](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#dataset-groups-api)

#### Version 1.8.5
  - Added Dataset Groups API is added. Please, refer to 
 [these docs](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#dataset-groups-api)
 for the description of the changes.

#### Version 1.7.4
 - Added `mapColumns` field to the Dataset Descriptions API. Please, refer to 
 [these docs](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#mapcolumns-field-in-dataset-descriptions-objects)
 for the description of the change.

#### Version 1.6.0
 - Added an optional `datasetStorage` field to Dataset Attributes API. `datasetStorage` valid values are: `"memory"`,
 `"database"`, and `"hadoop"`.

#### Version 1.5.0
 - Added [Dataset Attributes API](https://github.com/Tellius/SmartQueryEngine/blob/master/docs/Middleware.md#dataset-attributes-api-methods).

#### Version 1.2.0
  - Added PipelineMetadata API.

#### Version 1.0.8
  - Added optional `dateColumn` to the Dataset Description model. This field is used in SmartQueryEngine to do filtering
  and grouping by date and time.

#### Version 1.0.6

  - Added new APIs for `ColorPaletteDataColors` and `ColorPaletteThemeColors` objects
  - Added fields for `ColorPaletteDataColors` and `ColorPaletteThemeColors` to `Viz` objects, removed `colorPaletter` field
  - Added field for `ChartParams` object to `Viz`
  - Renamed `width`, `height`, `column` fields in `Placement` objects in `VizPad`s to `sizeX`, `sizeY`, and `col`
  - Fixed bug with updates on `Viz` objects
  - Docs for `Viz` creation, `VizPad` creation were updated to reflect the changes; docs for new APIs were added.

#### Version 1.0.5
  
  - Please, use the following endpoint to access API: http://52.4.36.178:8080
  - `User` object has a new optional field: `profilePicId` which can contain id of a profile pic for the user. Profile pic can be saved via thumbnails API (it doesn't transform images in any way at this point, thus can be used to save not only Viz/VizPad thumbnails, but also profile pics). No additional validation is performed on this field at the moment
  - `TimeRange` object has a new optional field `filterColumn`. It is a string; no additional validations. `TimeRange` is used in `Viz` and `VizPad` objects
  - The type of a field `colorPalette` in `Viz` object has been change to a `ColorPalette` object. It is also an optional field.
  - `layout` field has been deleted from `VizPad` object. Instead, a new field `placement` containing a list of  `VizPlacement` objects has been added to `VizPad`
  - Docs for `Viz` and `VizPad` creation and list methods have been updated to reflect changes to the objects.  


### General notes

- All database models have `createdAt` and `updatedAt` fields. We don't explicitly write them in this doc for brevity,
but they are always returned within the objects. They are created and managed automatically; you cannot manually
change or delete them.

### Auth methods

- Login method: `POST /login`:

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        http://localhost:8080/login \
        --data '{"username": "testUser1", "password": "barzoo"}'
    ```

    **Arguments**: JSON with username, and password.
    
    **Result**: Checks user's credentials and returns a JWT token which needs to be passed in all future requests.

    ```json
    {
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJncm91cHMiOltdLCJpZCI6IjU2ODI2MjY5ZWQ5Mzc2NGU4MGJlZmM5MCJ9.tnJ2tIQQMh_4IaIcZkwk2pv3LkehDqyCz6rQfk6pd09ybKLi7lqLhgmIRnb7lwTj0i2G3-hHVAhNJxbhm1a11Q",
      "id": "56826269ed93764e80befc90"
    }
    ```
    
- Signup method: `POST /signup`:

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        http://localhost:8080/signup \
        --data '{"username": "testUser1", "password": "barzoo", "email": "test@gmail.com"}'
    ```

    **Arguments**: JSON with username, password and email.
    
    **Result**: Creates a new user and returns a JWT token which needs to be passed in all future requests, together with a new user's id:

    ```json
    {
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJncm91cHMiOltdLCJpZCI6IjU2ODI2MjY5ZWQ5Mzc2NGU4MGJlZmM5MCJ9.tnJ2tIQQMh_4IaIcZkwk2pv3LkehDqyCz6rQfk6pd09ybKLi7lqLhgmIRnb7lwTj0i2G3-hHVAhNJxbhm1a11Q",
      "id": "56826269ed93764e80befc90"
    }
    ```


### User management methods

- Users list method: `/users`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/users
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.
    
    **Result**: Returns a list of all registered users.

    ```json
    {
      "users": [
        {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        {
          "username": "testUser1",
          "email": "test@gmail.com",
          "groups": [],
          "id": "56826269ed93764e80befc90"
        }
      ]
    }
    ```

- Get user by id: `/users/:userId`

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/users/56826269ed93764e80befc90
    ```
    
    **Arguments**: None
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers and the user with `:userId` can access this view.
    
    **Result**: Returns a user object for the user with id `:userId`.

    ```json
    {
      "username": "testUser1",
      "email": "test@gmail.com",
      "groups": [],
      "id": "56826269ed93764e80befc90"
    }
    ```

- Create a new user: `POST /users`. Important differences with `/signup` are:

  - New user is returned instead of this user's token
  - User is added to the groups passed in the request
  - `/signup` is available without auth; this method is available only to SuperUsers by default

  ```bash
  curl -v  -H "Content-Type: application/json" \
      -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
      http://localhost:8080/users \
      --data '{"username": "newTestUser3", "password": "barzoo", "email": "another@gmail.com", "groupsIds": ["5675959437bab64e38c7b8fa"]}'
  ```

  **Arguments**: User object

  **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

  **Result**: Creates a new user and returns it.

  ```json
  {
    "username": "newTestUser3",
    "email": "another@gmail.com",
    "groups": [{
      "name": "SuperUsers",
      "permissions": [],
      "id": "5675959437bab64e38c7b8fa"
    }],
    "id": "568263ffed93764e80befc92"
  }
  ```

- Update an existing user: `PUT /users/:userId`. You need to pass only those parameters of a `User` object you want to change. Only SuperUsers can change groups, for requests from other users this parameter is ignored.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/users/568263ffed93764e80befc92 \
        --data '{"email": "aNewEmail@gmail.com", "groups": ["sdf3234dsfsdf349j"]}'
    ```
    
    **Arguments**: Update user object. Note that groups should be passed as a list of strings, each string corresponding to an id of a group.
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers and the user with `:userId` can access this view.
    
    **Result**: Updates an existing user. Updated user is returened.

    ```json
    {
      "username": "newTestUser3",
      "email": "aNewEmail@gmail.com",
      "groups": [{
        "name": "SuperUsers",
        "permissions": [],
        "id": "5675959437bab64e38c7b8fa"
      }],
      "id": "568263ffed93764e80befc92"
    }
    ```

- Delete an existing user: `DELETE /users/:userId`. 

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/users/568263ffed93764e80befc92
    ```
    
    **Arguments**: None
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers and the user with `:userId` can access this view.
    
    **Result**: Only status code is returned.


### Group management methods

- Groups list method: `/groups`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/groups
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.
    
    **Result**: Returns a list of all registered groups.

    ```json
    {
      "groups": [{
        "name": "SuperUsers",
        "permissions": [],
        "id": "5675959437bab64e38c7b8fa"
      }]
    }
    ```

- Get group by id: `/groups/:groupId`

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/groups/5675959437bab64e38c7b8fa
    ```
    
    **Arguments**: None
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.
    
    **Result**: Returns a group object for the group with id `:groupId`.

    ```json
    {
      "groups": [{
        "name": "SuperUsers",
        "permissions": [],
        "id": "5675959437bab64e38c7b8fa"
      }]
    }
    ```

- Create a new group: `POST /groups`.

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/groups \
        --data '{"name": "usersListViewers", "permissions": [{"url": "users", "methods": ["GET"]}]}'
    ```
    
    **Arguments**: Group object
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.
    
    **Result**: Creates a new group and returns it.

    ```json
    {
      "name": "usersListViewers",
      "permissions": [{
        "url": "users",
        "methods": ["GET"]
      }],
      "id": "568264b3ed93764e80befc93"
    }
    ```

- Update an existing group: `PUT /groups/:groupId`. You need to pass only those parameters of a `Group` object you want to change. Only SuperUsers can change groups.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/groups/568264b3ed93764e80befc93 \
        --data '{"permissions": [{"url": "users", "methods": ["GET"]}, {"url": "groups", "methods": ["GET"]}]}'
    ```
    
    **Arguments**: Group update object
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers and the user with `:userId` could access this view.
    
    **Result**: Updates an existing group. Updated group is returened.

    ```json
    {
      "name": "usersListViewers",
      "permissions": [{
        "url": "users",
        "methods": ["GET"]
      }, {
        "url": "groups",
        "methods": ["GET"]
      }],
      "id": "568264b3ed93764e80befc93"
    }
    ```

- Delete an existing group: `DELETE /groups/:groupId`. 

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/groups/567595de37bab64e38c7b8fb
    ```
    
    **Arguments**: None
    
    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.
    
    **Result**: Only status code is returned.


### Dataset Description API methods

- Get dataset description by id: `/dataset/:datasetId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/dataset/dataset4
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Returns a dataset description object for the dataset with id `:datasetId`.

    ```json
    {
      "datasetId": "dataset4",
      "columns": [{
        "name": "country"
      }, {
        "name": "city",
        "type": "measure"
      }, {
        "name": "area"
      }],
      "hierarchies": [{
        "name": "geoHierarchy",
        "columns": ["country", "area", "city"]
      }],
      "dateColumn": "datetime",
      "id": "567cd28f37bab686bc22c3d0"
    }
    ```

- Create a new dataset description: `POST /dataset`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/dataset \
        --data '{"datasetId": "dataset4",
                 "columns": [{"name": "country"}, {"name": "city"}, {"name": "area", "type": "dimension"}],
                 "hierarchies": [{"name": "geoHierarchy", "columns": ["country", "area", "city"]}]}'
    ```

    **Arguments**: Dataset Description object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Creates a new Dataset Description and returns it.

    ```json
    {
      "datasetId": "dataset4",
      "columns": [{
        "name": "country"
      }, {
        "name": "city",
      }, {
        "name": "area",
        "type": "dimension"
      }],
      "hierarchies": [{
        "name": "geoHierarchy",
        "columns": ["country", "area", "city"]
      }],
      "dateColumn": "datetime",
      "id": "567cd28f37bab686bc22c3d0"
    }
    ```

- Update an existing dataset description: `PUT /dataset/:datasetId`. You need to pass only those parameters of a `Dataset Description` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/dataset/datset4 \
        --data '{"columns": [{"name": "country"}, {"name": "city", "type": "measure"}, {"name": "area", "type": "dimension"}]}'
    ```

    **Arguments**: Dataset description update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing dataset description. Updated dataset description is returened.

    ```json
    {
      "datasetId": "dataset4",
      "columns": [{
        "name": "country"
      }, {
        "name": "city",
        "type": "measure"
      }, {
        "name": "area",
        "type": "dimension"
      }],
      "hierarchies": [{
        "name": "geoHierarchy",
        "columns": ["country", "area", "city"]
      }],
      "id": "567cd28f37bab686bc22c3d0"
    }
    ```

- Delete an existing dataset description: `DELETE /dataset/:datasetId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/dataset/dataset4
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
- Dataset Descriptions list method `/dataset`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/dataset
    ```

    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. Only SuperUsers can access this view.

    **Result**: Returns a list of all Dataset Descriptions.

    ```json
    {
      "datasetDescriptions": [{
        "hierarchies": [],
        "datasetId": "266c62c8-3a4d-43cf-ae60-6cc02f61f5de",
        "id": "57183f7743c353484e71d211",
        "columns": [{
          "name": "Price"
        }, {
          "name": "Mileage"
        }, {
          "name": "Make"
        }, {
          "name": "Model"
        }, {
          "name": "Trim"
        }, {
          "name": "Type"
        }, {
          "name": "Cylinder"
        }, {
          "name": "Liter"
        }, {
          "name": "Doors"
        }, {
          "name": "Cruise"
        }, {
          "name": "Sound"
        }, {
          "name": "Leather"
        }, {
          "name": "memsql_insert_time"
        }],
        "createdAt": "2016-04-21T02:48:23.827Z"
      },
      ...
    ]}
    ```

### Viz API Methods

Note, that `dataId` property of Viz objects is just some id of data that frontend will use to fetch that data from a remote source.
The Middleware App doesn't try to fetch this data; doesn't know where it's stored; and treats the `dataId` property
as just string, without validation or any processing whatsoever.

- Viz list method `/viz`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/viz
    ```

    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of all current user's Viz objects.

    ```json
    {
      "vizs": [{
        "yAxis": {
          "column": "money",
          "aggregation": "sum"
        },
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z",
          "filterColumn": "time"
        },
        "thumbnail": "3242332sddsfsff3434",
        "id": "56be8335c24630134a0c3185",
        "dataId": "df1",
        "filters": [{
          "column": "money",
          "operator": ">=",
          "value": "100.0"
        }],
        "createdAt": "2016-02-13T01:13:25.128Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "My first Viz ever4",
        "type": "BarChart",
        "xAxis": {
          "column": "time",
          "resolution": "daily"
        }
      },
      ...
    ]}
    ```

- Get Viz by id: `/viz/:vizId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/viz/56be8335c24630134a0c3185
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a Viz with given `:vizId`

    ```json
    {
      "yAxis": {
        "column": "money",
        "aggregation": "sum"
      },
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "3242332sddsfsff3434",
      "id": "56be8335c24630134a0c3185",
      "dataId": "df1",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-02-13T01:13:25.128Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "title": "My first Viz ever4",
      "type": "BarChart",
      "xAxis": {
        "column": "time",
        "resolution": "daily"
      }
    }
    ```

- Create a new Viz object: `POST /viz`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/viz \
        --data '{
          "ownerId": "567595de37bab64e38c7b8fb",
          "dataId": "df1", "type": "BarChart", "title": "My first Viz ever4",
          "xAxis": {"column": "time", "resolution": "daily"},
          "yAxis": {"column": "money", "aggregation": "sum"},
          "colorPaletteDataColors": "56d1ef87c246300cccac1137",
          "colorPaletteThemeColors": "56d1f386c246300cccac1139",
          "chartParams": {
            "color": "#FF0000",
            "radius": {"column": "time", "resolution": "daily", "aggregation": "sum"},
            "label": "myLabel",
            "polarLine": [{"column": "time", "resolution": "daily", "aggregation": "sum"}],
            "polarArea": [{"column": "time", "resolution": "daily", "aggregation": "sum"}],
            "polarColumn": [{"column": "time", "resolution": "daily", "aggregation": "sum"}],
            "tableRows": ["row1", "row2", "row3"],
            "tableColumns": ["year", "month", "time"],
            "tableValue": [{"column": "time", "resolution": "daily", "aggregation": "sum"}],
            "additionalFields": "some additional data"},
          "filters": [{"column": "money", "operator": ">=", "value": 100.0}],
          "timeRange": {
            "type": "custom",
            "from": "2013-12-31T21:00:00.000+03:00",
            "to": "2016-12-31T12:00:00.000+03:00",
            "filterColumn": "time"
          },
          "thumbnail": "3242332sddsfsff3434"}'
    ```

    or with a minimal required parameters:

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/viz \
            --data '{
              "ownerId": "567595de37bab64e38c7b8fb",
              "dataId": "df1", "type": "BarChart",
              "title": "My first Viz ever14",
              "xAxis": {"column": "time"},
              "yAxis": {"column": "money"},
              "thumbnail": "2322323"}'
    ```

    **Arguments**: Viz object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new Viz object and returns it.

    ```json
    {
      "colorPaletteThemeColors": {
        "yAxisTitleColor": "#00FF00",
        "yAxisValuesColor": "#006600",
        "backgroundColor": "#FFFFFF",
        "xAxisTitleColor": "#FF00000",
        "textColor": "#111111",
        "legendTextColor": "#000000",
        "id": "56d1f386c246300cccac1139",
        "xAxisValuesColor": "#660000",
        "createdAt": "2016-02-27T19:05:42.345Z",
        "gridColor": "#333333"
      },
      "yAxis": {
        "column": "money",
        "aggregation": "sum"
      },
      "colorPaletteDataColors": {
        "id": "56d1ef87c246300cccac1137",
        "colors": ["#FF0000", "#00FF00", "#0000FF"],
        "createdAt": "2016-02-27T18:48:39.348Z"
      },
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "3242332sddsfsff3434",
      "id": "56d21437c246301416f1e9ea",
      "dataId": "df1",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-02-27T21:25:11.193Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "chartParams": {
        "label": "myLabel",
        "polarLine": [{
          "column": "time",
          "resolution": "daily",
          "aggregation": "sum"
        }],
        "color": "#FF0000",
        "radius": {
          "column": "time",
          "resolution": "daily",
          "aggregation": "sum"
        },
        "tableValue": [{
          "column": "time",
          "resolution": "daily",
          "aggregation": "sum"
        }],
        "polarArea": [{
          "column": "time",
          "resolution": "daily",
          "aggregation": "sum"
        }],
        "polarColumn": [{
          "column": "time",
          "resolution": "daily",
          "aggregation": "sum"
        }],
        "additionalFields": "some additional data"
      },
      "title": "My first Viz ever4",
      "type": "BarChart",
      "xAxis": {
        "column": "time",
        "resolution": "daily"
      }
    }
    ```

- Update an existing Viz: `PUT /viz/:vizId`. You need to pass only those parameters of a Viz object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/viz/56826e94ed93762f804815a5 \
        --data '{"title": "My NOT SO first Viz ever4", "filters": [{"column": "money", "operator": "<=", "value": 1000}]}'
    ```

    **Arguments**: Viz update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing Viz. Updated Viz object is returened.

    ```json
    {
      "yAxis": {
        "column": "money",
        "aggregation": "sum"
      },
      "dataId": "df1",
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z"
      },
      "thumbnail": "thumb1.jpg",
      "id": "56826e94ed93762f804815a5",
      "filters": [{
        "column": "money",
        "operator": "<=",
        "value": "1000"
      }],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "title": "My NOT SO first Viz ever4",
      "type": " BarChart",
      "xAxis": {
        "column": "time",
        "resolution": "daily"
      }
    }
    ```

- Delete an existing Viz: `DELETE /viz/:vizId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/viz/56826e94ed93762f804815a5
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.


### VizPad API Methods

- VizPad list method `/vizpad`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/vizpad?includingShared=true&limit=10&offset=300
    ```

    **Arguments**:
      *includingShared* - either `true` or `false`. If `true`, will return not only objects, created by this user, but also object that were shared with him.
      *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of all current user's VizPad objects.

    ```json
    {
      "vizPads": [{
        {
          "vizs": [{
             "colorPaletteThemeColors": {
               "yAxisTitleColor": "#00FF00",
               "yAxisValuesColor": "#006600",
               "backgroundColor": "#FFFFFF",
               "xAxisTitleColor": "#FF00000",
               "textColor": "#111111",
               "legendTextColor": "#000000",
               "id": "56d1f386c246300cccac1139",
               "xAxisValuesColor": "#660000",
               "createdAt": "2016-02-27T19:05:42.345Z",
               "gridColor": "#333333"
             },
             "yAxis": {
               "column": "money",
               "aggregation": "sum"
             },
             "colorPaletteDataColors": {
               "id": "56d1ef87c246300cccac1137",
               "colors": ["#FF0000", "#00FF00", "#0000FF"],
               "createdAt": "2016-02-27T18:48:39.348Z"
             },
             "timeRange": {
               "type": "custom",
               "from": "2013-12-31T18:00Z",
               "to": "2016-12-31T09:00Z",
               "filterColumn": "time"
             },
             "thumbnail": "3242332sddsfsff3434",
             "id": "56d21437c246301416f1e9ea",
             "dataId": "df1",
             "filters": [{
               "column": "money",
               "operator": ">=",
               "value": "100.0"
             }],
             "createdAt": "2016-02-27T21:25:11.193Z",
             "owner": {
               "username": "superUser",
               "email": "another2@gmail.com",
               "groups": [{
                 "name": "SuperUsers",
                 "permissions": [],
                 "id": "5675959437bab64e38c7b8fa",
                 "createdAt": "2016-01-15T16:44:03.809Z"
               }],
               "id": "567595de37bab64e38c7b8fb"
             },
             "chartParams": {
               "label": "myLabel",
               "polarLine": [{
                 "column": "time",
                 "resolution": "daily",
                 "aggregation": "sum"
               }],
               "color": "#FF0000",
               "radius": {
                 "column": "time",
                 "resolution": "daily",
                 "aggregation": "sum"
               },
               "tableValue": [{
                 "column": "time",
                 "resolution": "daily",
                 "aggregation": "sum"
               }],
               "polarArea": [{
                 "column": "time",
                 "resolution": "daily",
                 "aggregation": "sum"
               }],
               "polarColumn": [{
                 "column": "time",
                 "resolution": "daily",
                 "aggregation": "sum"
               }],
               "additionalFields": "some additional data"
             },
             "title": "My first Viz ever11",
             "type": "BarChart",
             "xAxis": {
               "column": "time",
               "resolution": "daily"
             }
           }],
          "sharingByLink": true,
          "timeRange": {
            "type": "custom",
            "from": "2013-12-31T18:00Z",
            "to": "2016-12-31T09:00Z",
            "filterColumn": "time"
          },
          "thumbnail": "p30r9kf9sd09dsfsdfsdf",
          "placement": [{
            "sizeY": 150,
            "row": 2,
            "vizId": "56be8335c24630134a0c3185",
            "col": 0,
            "sizeX": 600
          }],
          "id": "56be84c8c24630134a0c3186",
          "filters": [{
            "column": "money",
            "operator": ">=",
            "value": "100.0"
          }],
          "createdAt": "2016-02-13T01:20:08.904Z",
          "sharedWith": [],
          "owner": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "title": "My first VizPad"
        }]
    }
    ```

- Get VizPad by id: `/vizpad/:vizpadId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/vizpad/568278e9ed937608ac5b8747
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a VizPad with given `:vizpadId`

    ```json
    {
      "vizs": [{
        "yAxis": {
          "column": "money",
          "aggregation": "sum"
        },
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z",
          "filterColumn": "time"
        },
        "thumbnail": "3242332sddsfsff3434",
        "id": "56be8335c24630134a0c3185",
        "dataId": "df1",
        "filters": [{
          "column": "money",
          "operator": ">=",
          "value": "100.0"
        }],
        "createdAt": "2016-02-13T01:13:25.128Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "My first Viz ever4",
        "type": "BarChart",
        "xAxis": {
          "column": "time",
          "resolution": "daily"
        }
      }],
      "sharingByLink": true,
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "placement": [{
        "sizeY": 150,
        "row": 2,
        "vizId": "56be8335c24630134a0c3185",
        "col": 0,
        "sizeX": 600
      }],
      "id": "56be84c8c24630134a0c3186",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-02-13T01:20:08.904Z",
      "sharedWith": [],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "title": "My first VizPad"
    }
    ```

- Create a new VizPad object: `POST /vizpad`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/vizpad \
        --data '{
          "ownerId": "567595de37bab64e38c7b8fb",
          "title": "My first VizPad",
          "vizs": ["56826daeed937674ac1c1544"],
          "placement": [{"vizId": "56be8335c24630134a0c3185", "sizeY": 150, "sizeX": 600, "row": 2, "col": 0}],
          "filters": [{"column": "money", "operator": ">=", "value": 100.0}],
          "timeRange": {
            "type": "custom",
            "from": "2013-12-31T21:00:00.000+03:00",
            "to": "2016 -12-31T12:00:00.000+03:00"},
          "thumbnail": "p30r9kf9sd09dsfsdfsdf",
          "sharingByLink": true,
          "sharedWith": []}'
    ```

    **Arguments**: VizPad object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new VizPad object and returns it.

    ```json
    {
      "vizs": [{
        "yAxis": {
          "column": "money",
          "aggregation": "sum"
        },
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z",
          "filterColumn": "time"
        },
        "thumbnail": "3242332sddsfsff3434",
        "id": "56be8335c24630134a0c3185",
        "dataId": "df1",
        "filters": [{
          "column": "money",
          "operator": ">=",
          "value": "100.0"
        }],
        "createdAt": "2016-02-13T01:13:25.128Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "My first Viz ever4",
        "type": "BarChart",
        "xAxis": {
          "column": "time",
          "resolution": "daily"
        }
      }],
      "sharingByLink": true,
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "placement": [{
        "sizeY": 150,
        "row": 2,
        "vizId": "56be8335c24630134a0c3185",
        "col": 0,
        "sizeX": 600
      }],
      "id": "56be84c8c24630134a0c3186",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-02-13T01:20:08.904Z",
      "sharedWith": [],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "title": "My first VizPad"
    }
    ```

- Update an existing VizPad: `PUT /vizpad/:vizpadId`. You need to pass only those parameters of a VizPad object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/vizpad/568278e9ed937608ac5b8747 \
        --data '{"sharedWith": ["56826269ed93764e80befc90"], "sharingByLink": false}'
    ```

    **Arguments**: VizPad update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing VizPad. Updated VizPad object is returened.

    ```json
    {
      "vizs": [{
        "yAxis": {
          "column": "money",
          "aggregation": "sum"
        },
        "dataId": "df1",
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z"
        },
        "thumbnail": "thumb1.jpg",
        "id": "56826daeed937674ac1c1544",
        "filters": [{
          "column": "money",
          "operator": ">=",
          "value": "100.0"
        }],
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "My first Viz ever",
        "type": " BarChart",
        "xAxis": {
          "column": "time",
          "resolution": "daily"
        }
      }],
      "sharingByLink": false,
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "id": "568278e9ed937608ac5b8747",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "sharedWith": [{
        "username": "testUser1",
        "email": "test@gmail.com",
        "groups": [],
        "id": "56826269ed93764e80befc90"
      }],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa"
        }],
        "id": "567595de37bab64e38c7b8fb"
      },
      "layout": "{\"testLayoutProperty\": true}",
      "title": "My first VizPad"
    }
    ```

- Delete an existing VizPad: `DELETE /vizpad/:vizpadId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/vizpad/56826e94ed93762f804815a5
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.


### Thumbnails API

- Upload a new thumbnail: `POST /thumbnail`

    ```bash
    curl -v -X POST \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        -F "thumbnail=@freelancer.PNG" \
        http://localhost:8080/thumbnail
    ```

    **Arguments**: *Multipart Form Data*: File in `thumbnail` property

    **Result**: Plain id of the saved GridFS object.

    ```bash
    568281b2ed93768f882942a2
    ```

- Download saved thumbnail: `GET /thumbnail/:thumbnailId`

    ```bash
    curl -v \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/thumbnail/568281b2ed93768f882942a2 \
    > test.png
    ```

    **Arguments**: None

    **Result**: The saved file with id `:thumbnailId`.

- Delete saved thumbnail: `DELETE /thumbnail/:thumbnailId`

    ```bash
    curl -v -X DELETE \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/thumbnail/568281b2ed93768f882942a2
    ```

    **Arguments**: None

    **Result**: Only status code is returned.
    

### ColorPaletteDataColors API

- ColorPaletteDataColors list method `/colorPaletteDataColors`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteDataColors
    ```

    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of all ColorPaletteDataColors objects.

    ```json
    {
      "colorPaletteDataColors": [{
        "id": "56d1ee45c246300cccac1136",
        "colors": ["#FF0000", "#00FF00", "#0000FF", "#666666"],
        "createdAt": "2016-02-27T18:43:17.158Z",
        "updatedAt": "2016-02-27T18:45:46.280Z"
      }]
    }
    ```

- Get ColorPaletteDataColors by id: `/colorPaletteDataColors/:colorPaletteDataColorsId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/colorPaletteDataColors/56d1ee45c246300cccac1136
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a ColorPaletteDataColors with given `:colorPaletteDataColorsId`

    ```json
    {
      "id": "56d1ee45c246300cccac1136",
      "colors": ["#FF0000", "#00FF00", "#0000FF"],
      "createdAt": "2016-02-27T18:43:17.158Z"
    }
    ```

- Create a new ColorPaletteDataColors object: `POST /colorPaletteDataColors`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteDataColors \
        --data '{"colors": ["#FF0000", "#00FF00", "#0000FF"]}'
    ```

    **Arguments**: ColorPaletteDataColors object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new ColorPaletteDataColors object and returns it.

    ```json
    {
      "id": "56d1ee45c246300cccac1136",
      "colors": ["#FF0000", "#00FF00", "#0000FF"],
      "createdAt": "2016-02-27T18:43:17.158Z"
    }
    ```

- Update an existing ColorPaletteDataColors: `PUT /colorPaletteDataColors/:colorPaletteDataColorsId`. 

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteDataColors/56d1ee45c246300cccac1136 \
        --data '{"colors": ["#FF0000", "#00FF00", "#0000FF", "#666666"]}'
    ```

    **Arguments**: ColorPaletteDataColors update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing ColorPaletteDataColors. Updated ColorPaletteDataColors object is returened.

    ```json
    {
      "id": "56d1ee45c246300cccac1136",
      "colors": ["#FF0000", "#00FF00", "#0000FF", "#666666"],
      "createdAt": "2016-02-27T18:43:17.158Z",
      "updatedAt": "2016-02-27T18:45:46.280Z"
    }
    ```

- Delete an existing ColorPaletteDataColors: `DELETE /colorPaletteDataColors/:colorPaletteDataColorsId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteDataColors/56d1ee45c246300cccac1136
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
    
### ColorPaletteThemeColors API

- ColorPaletteThemeColors list method `/colorPaletteThemeColors`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteThemeColors
    ```

    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of all ColorPaletteThemeColors objects.

    ```json
    {
      "colorPaletteThemeColors": [{
        "yAxisTitleColor": "#00FF00",
        "yAxisValuesColor": "#006600",
        "backgroundColor": "#FFFFFF",
        "xAxisTitleColor": "#FF00000",
        "textColor": "#111111",
        "legendTextColor": "#000000",
        "id": "56d1f0d2c246300cccac1138",
        "xAxisValuesColor": "#660000",
        "createdAt": "2016-02-27T18:54:10.075Z",
        "gridColor": "#333333"
      }]
    }
    ```

- Get ColorPaletteThemeColors by id: `/colorPaletteThemeColors/:colorPaletteThemeColorsId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/colorPaletteThemeColors/56d1f0d2c246300cccac1138
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a ColorPaletteThemeColors with given `:colorPaletteThemeColors`

    ```json
    {
      "yAxisTitleColor": "#00FF00",
      "yAxisValuesColor": "#006600",
      "backgroundColor": "#FFFFFF",
      "xAxisTitleColor": "#FF00000",
      "textColor": "#111111",
      "legendTextColor": "#000000",
      "id": "56d1f0d2c246300cccac1138",
      "xAxisValuesColor": "#660000",
      "createdAt": "2016-02-27T18:54:10.075Z",
      "gridColor": "#333333"
    }
    ```

- Create a new ColorPaletteThemeColors object: `POST /colorPaletteThemeColors`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteThemeColors \
        --data '{"backgroundColor": "#FFFFFF",
            "legendTextColor": "#000000",
            "xAxisTitleColor": "#FF00000",
            "xAxisValuesColor": "#660000",
            "yAxisTitleColor": "#00FF00",
            "yAxisValuesColor": "#006600", 
            "gridColor": "#333333", 
            "textColor": "#111111"}' 
    ```

    **Arguments**: ColorPaletteThemeColors object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new ColorPaletteThemeColors object and returns it.

    ```json
    {
      "yAxisTitleColor": "#00FF00",
      "yAxisValuesColor": "#006600",
      "backgroundColor": "#FFFFFF",
      "xAxisTitleColor": "#FF00000",
      "textColor": "#111111",
      "legendTextColor": "#000000",
      "id": "56d1f0d2c246300cccac1138",
      "xAxisValuesColor": "#660000",
      "createdAt": "2016-02-27T18:54:10.075Z",
      "gridColor": "#333333"
    }
    ```

- Update an existing ColorPaletteThemeColors: `PUT /colorPaletteThemeColors/:colorPaletteThemeColorsId`. 

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteThemeColors/56d1f0d2c246300cccac1138 \
        --data '{"backgroundColor": "#FFFFFF",
            "legendTextColor": "#000000",
            "xAxisTitleColor": "#FF00000",
            "xAxisValuesColor": "#660000",
            "yAxisTitleColor": "#00FF00",
            "yAxisValuesColor": "#006600",
            "gridColor": "#333333",
            "textColor": "#121111"}' 
    ```

    **Arguments**: ColorPaletteThemeColors update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing ColorPaletteThemeColors. Updated ColorPaletteThemeColors object is returened.

    ```json
    {
      "yAxisTitleColor": "#00FF00",
      "yAxisValuesColor": "#006600",
      "backgroundColor": "#FFFFFF",
      "updatedAt": "2016-02-27T19:03:54.142Z",
      "xAxisTitleColor": "#FF00000",
      "textColor": "#121111",
      "legendTextColor": "#000000",
      "id": "56d1f0d2c246300cccac1138",
      "xAxisValuesColor": "#660000",
      "createdAt": "2016-02-27T18:54:10.075Z",
      "gridColor": "#333333"
    }
    ```

- Delete an existing ColorPaletteThemeColors: `DELETE /colorPaletteThemeColors/:colorPaletteThemeColorsId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/colorPaletteThemeColors/56d1f0d2c246300cccac1138
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
### Pipeline Metadata Methods

Note, that instead of using mongo-provided `id`s for identifying object in delete and get methods, we use `uuid`s,
provided by user. In update method, we use `id`s as in all other API methods, since we want to allow changing of 
`uuid`s. 

Also, update method works differently here: instead of providing patch functionality,
we provide simpler replace functionality (i.e., if you don't provide an optional field, it will be deleted; 
if you don't provide a required field, the method will fail).

There are some differencies between the specs and the actual implementations. They were done to conform to other APIs.
Here's the main ones:

- endpoints were simplified and proper HTTP verbs used.
- `id` is a mongo db specific id, autogenerated by mongo. A field `uuid` is used instead of `id` from specs.
- instead of `created` subobject we use combination of fields `owner` and `createdAt`.
- errors are returned as in all the other APIs. When an error occurs, a status code different from `200` is returned, 
and a simple text message is returned to indicate the error type, for instance when you try to access non-existing 
pipeline, you will receive this response:

 ```bash
 < HTTP/1.1 400 Bad Request
 < Content-Type: text/plain; charset=UTF-8
 < Date: Thu, 14 Apr 2016 23:38:31 GMT
 < Server: akka-http/2.4.2
 < Content-Length: 41
 < Connection: keep-alive
 <
 * Connection #0 to host sqe-lb-449024333.us-east-1.elb.amazonaws.com left intact
 PipelineMetadata with uuid doesn't exists
 ```
 
Otherwise, everything should work according to specs.

- Pipeline Metadata list method `/pipeline`:

    ```bash
    curl -v  -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/pipeline
    ```

    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of all current user's Pipeline Metadata objects. If the request was made by a SuperUser,
    the method will return all Pipeline Metadata objests in the system.

    ```json
    {
      "pipelineMetadatas": [{
        "stages": [{
          "uuid": "2",
          "name": "stage1",
          "type": "stageType",
          "tasks": []
        }, {
          "parent": "2",
          "name": "stage2",
          "uuid": "3",
          "tasks": [{
            "spatial": {
              "next": "5"
            },
            "uuid": "4",
            "datasets": {
              "before": "5",
              "after": "6"
            },
            "options": "{}",
            "type": "taskType"
          }, {
            "spatial": {
              "previous": "4"
            },
            "uuid": "5",
            "datasets": {
    
            },
            "options": "{}",
            "type": "anotherTaskType"
          }],
          "visual": {
            "x": 14.3,
            "y": 300.4
          },
          "type": "someOtherStageType"
        }],
        "name": "testPipeline",
        "uuid": "1",
        "id": "570ffd96dc739532066cbe91",
        "createdAt": "2016-04-14T20:29:10.553Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      }, {
        "stages": [{
          "uuid": "2",
          "name": "stage1",
          "type": "stageType",
          "tasks": []
        }, {
          "parent": "2",
          "name": "stage2",
          "uuid": "3",
          "tasks": [{
            "spatial": {
              "next": "5"
            },
            "uuid": "4",
            "datasets": {
              "before": "5",
              "after": "6"
            },
            "options": "{}",
            "type": "taskType"
          }, {
            "spatial": {
              "previous": "4"
            },
            "uuid": "5",
            "datasets": {
    
            },
            "options": "{}",
            "type": "anotherTaskType"
          }],
          "visual": {
            "x": 14.3,
            "y": 300.4
          },
          "type": "someOtherStageType"
        }],
        "name": "testPipeline1",
        "uuid": "2",
        "id": "570ffea5dc739533ea3241e6",
        "createdAt": "2016-04-14T20:33:41.751Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      },
      ...
      ]
    }
    ```

- Get Pipeline Metadata by `uuid`: `/pipeline/:pipelineUuid`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/pipeline/2
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a Pipeline Metadata with given `:pipelineUuid`

    ```json
    {
      "stages": [{
        "uuid": "2",
        "name": "stage1",
        "type": "stageType",
        "tasks": []
      }, {
        "parent": "2",
        "name": "stage2",
        "uuid": "3",
        "tasks": [{
          "spatial": {
            "next": "5"
          },
          "uuid": "4",
          "datasets": {
            "before": "5",
            "after": "6"
          },
          "options": "{}",
          "type": "taskType"
        }, {
          "spatial": {
            "previous": "4"
          },
          "uuid": "5",
          "datasets": {
    
          },
          "options": "{}",
          "type": "anotherTaskType"
        }],
        "visual": {
          "x": 14.3,
          "y": 300.4
        },
        "type": "someOtherStageType"
      }],
      "name": "NEWNAME",
      "uuid": "2",
      "id": "570ffea5dc739533ea3241e6",
      "createdAt": "2016-04-14T20:36:01.319Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Create a new Pipeline Metadata object: `POST /pipeline`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/pipeline \
        --data '{"ownerId": "567595de37bab64e38c7b8fb",
          "uuid": "2", "name": "testPipeline1",
          "stages": [
            {"uuid": "2", "name": "stage1", "type": "stageType", "tasks":[]},
            {"uuid": "3", "name": "stage2", "type": "someOtherStageType", 
             "parent": "2", "visual": {"x": 14.3, "y": 300.4},
             "tasks": [
               {"uuid": "4", "type": "taskType", "options": "{}",
                "datasets": {"before": "5", "after": "6"},
                "spatial": {"next": "5"}},
               {"uuid": "5", "type": "anotherTaskType", "options": "{}", "datasets": {}, "spatial": {"previous": "4"}}
             ]
            }
          ]
        }'
    ```

    **Arguments**: Pipeline Metadata  object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new Pipeline Metadata object and returns it.

    ```json
    {
      "stages": [{
        "uuid": "2",
        "name": "stage1",
        "type": "stageType",
        "tasks": []
      }, {
        "parent": "2",
        "name": "stage2",
        "uuid": "3",
        "tasks": [{
          "spatial": {
            "next": "5"
          },
          "uuid": "4",
          "datasets": {
            "before": "5",
            "after": "6"
          },
          "options": "{}",
          "type": "taskType"
        }, {
          "spatial": {
            "previous": "4"
          },
          "uuid": "5",
          "datasets": {
    
          },
          "options": "{}",
          "type": "anotherTaskType"
        }],
        "visual": {
          "x": 14.3,
          "y": 300.4
        },
        "type": "someOtherStageType"
      }],
      "name": "testPipeline1",
      "uuid": "2",
      "id": "570ffea5dc739533ea3241e6",
      "createdAt": "2016-04-14T20:33:41.751Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Update an existing Pipeline Metadata: `PUT /pipeline/:pipelineUuid`.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/pipeline/570ffea5dc739533ea3241e6 --data '{
          "ownerId": "567595de37bab64e38c7b8fb",
          "uuid": "2",
          "name": "NEWNAME",
          "stages": [
            {"uuid": "2", "name": "stage1", "type": "stageType", "tasks":[]},
            {"uuid": "3", "name": "stage2", "type": "someOtherStageType",
             "parent": "2", "visual": {"x": 14.3, "y": 300.4},
             "tasks": [
               {"uuid": "4", "type": "taskType", "options": "{}",
                "datasets": {"before": "5", "after": "6"}, "spatial": {"next": "5"}},
               {"uuid": "5", "type": "anotherTaskType", "options": "{}", "datasets": {},
                "spatial": {"previous": "4"}}]}]}'
    ```

    **Arguments**: Pipeline Metadata update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing Pipeline Metadata. Updated Pipeline Metadata object is returened.

    ```json
    {
      "stages": [{
        "uuid": "2",
        "name": "stage1",
        "type": "stageType",
        "tasks": []
      }, {
        "parent": "2",
        "name": "stage2",
        "uuid": "3",
        "tasks": [{
          "spatial": {
            "next": "5"
          },
          "uuid": "4",
          "datasets": {
            "before": "5",
            "after": "6"
          },
          "options": "{}",
          "type": "taskType"
        }, {
          "spatial": {
            "previous": "4"
          },
          "uuid": "5",
          "datasets": {
    
          },
          "options": "{}",
          "type": "anotherTaskType"
        }],
        "visual": {
          "x": 14.3,
          "y": 300.4
        },
        "type": "someOtherStageType"
      }],
      "name": "NEWNAME",
      "uuid": "2",
      "id": "570ffea5dc739533ea3241e6",
      "createdAt": "2016-04-14T20:36:01.319Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Delete an existing Pipeline Metadata: `DELETE /pipeline/:pipelineUuid`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/pipeline/1
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.


### Dataset Attributes API methods

- Get Dataset Attributes object by id: `/datasetAttributes/:datasetId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/datasetAttributes/datasetAttributesTest
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Returns a Dataset Attributes object for the dataset with id `:datasetId`.

    ```json
    {
      "createdOn": "2016-03-13T01:13:25.128Z",
      "sourceType": "json",
      "size": 39348384,
      "datasetName": "Dataset Attributes Test",
      "dataSourceName": "source1",
      "datasetStorage": "memory",
      "datasetId": "datasetAttributesTest",
      "id": "571abb84dc73956fdc0b3956",
      "currentSourceId": "XBzIjpbeyJuYW1lIjoiU3VwZXJ",
      "schedule": "schedule1",
      "createdAt": "2016-04-23T00:02:12.340Z",
      "jobs": ["job1", "job2"]
    }
    ```

- Create a new Dataset Attributes object: `POST /datasetAttributes`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetAttributes \
        --data '{"datasetId": "datasetAttributesTest",
          "datasetName": "Dataset Attributes Test",
          "currentSourceId": "XBzIjpbeyJuYW1lIjoiU3VwZXJ",
          "createdOn": "2016-03-13T01:13:25.128Z",
          "sourceType": "json",
          "size": 39348384,
          "dataSourceName": "source1",
          "jobs": ["job1", "job2"], 
          "schedule": "schedule1",
          "datasetStorage": "memory"}'
    ```

    **Arguments**: Dataset Attributes object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Creates a new Dataset Attributes and returns it.

    ```json
    {
      "createdOn": "2016-03-13T01:13:25.128Z",
      "sourceType": "json",
      "size": 39348384,
      "datasetName": "Dataset Attributes Test",
      "dataSourceName": "source1",
      "datasetId": "datasetAttributesTest",
      "datasetStorage": "memory",
      "id": "571abb84dc73956fdc0b3956",
      "currentSourceId": "XBzIjpbeyJuYW1lIjoiU3VwZXJ",
      "schedule": "schedule1",
      "createdAt": "2016-04-23T00:02:12.340Z",
      "jobs": ["job1", "job2"]
    }
    ```

- Update an existing Dataset Attributes: `PUT /datasetAttributes/:datasetId`. You need to pass only those parameters of a `Dataset Attributes` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetAttributes/datasetAttributesTest \
        --data '{"datasetName": "Dataset Attributes Test New Name"}'
    ```

    **Arguments**: Dataset Attributes update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing Dataset Attributes. Updated Dataset Attributes is returened.

    ```json
    {
      "updatedAt": "2016-04-23T00:08:18.179Z",
      "createdOn": "2016-03-13T01:13:25.128Z",
      "sourceType": "json",
      "size": 39348384,
      "datasetName": "Dataset Attributes Test New Name",
      "dataSourceName": "source1",
      "datasetStorage": "memory",
      "datasetId": "datasetAttributesTest",
      "id": "571abb84dc73956fdc0b3956",
      "currentSourceId": "XBzIjpbeyJuYW1lIjoiU3VwZXJ",
      "schedule": "schedule1",
      "createdAt": "2016-04-23T00:02:12.340Z",
      "jobs": ["job1", "job2"]
    }
    ```

- Delete an existing dataset attributes object: `DELETE /datasetAttributes/:datasetId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetAttributes/datasetAttributesTest
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
#### Note about createdAt and createdOn fields

The meaning of the two fields (createdAt and createdOn) is different.
createdAt is used by all objects in the middleware to save the time when the object has been created in the database.
createdOn is the time when the dataset was created in the spark, which is a different from createdAt time. 
createdAt is created automatically, you cannot change it. createdOn is optional field that user may or may not submit.

### `mapColumns` field in Dataset Descriptions Objects

To be able to perform Map Queries, we added a new field to the Dataset Description objects. The field is an optional
list of objects, each containing the following fields (all are strings):

- `name` of the MapColumns object
- `longitude` - name of the column to use as a longitude while performing Map Queries
- `latitude` - name of the column to use as a latitude while performing Map Queries

Let's add this field to the existing object:

```bash
curl -v -X PUT -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUz...Q2yrkg" \
    http://52.87.228.68:8080/dataset/trip_data --data '{
        "mapColumns": [
            {
                "name": "dropoff_location",
                "longitude": "dropoff_longitude",
                "latitude": "dropoff_latitude"
            }, {
                "name": "pickup_location", 
                "longitude": "pickup_longitude", 
                "latitude": "dropoff_latitude"
            }
        ]}'
```

That's how the dataset description will look now:

```json
{
  "hierarchies": [],
  "updatedAt": "2016-05-07T19:21:02.883Z",
  "datasetId": "trip_data",
  "id": "5723e51b43c3537a9de8eac8",
  "columns": [{
    "name": "id",
    "type": "measure"
  }, {
    "name": "medallion",
    "type": "dimension"
  }, {
    "name": "hack_license",
    "type": "dimension"
  }, {
    "name": "vendor_id",
    "type": "dimension"
  }, {
    "name": "rate_code",
    "type": "dimension"
  }, {
    "name": "store_and_fwd_flag",
    "type": "dimension"
  }, {
    "name": "pickup_datetime",
    "type": "dimension"
  }, {
    "name": "dropoff_datetime",
    "type": "dimension"
  }, {
    "name": "passenger_count",
    "type": "dimension"
  }, {
    "name": "trip_time_in_secs",
    "type": "measure"
  }, {
    "name": "trip_distance",
    "type": "measure"
  }, {
    "name": "pickup_longitude",
    "type": "dimension"
  }, {
    "name": "pickup_latitude",
    "type": "dimension"
  }, {
    "name": "dropoff_longitude",
    "type": "dimension"
  }, {
    "name": "dropoff_latitude",
    "type": "dimension"
  }],
  "mapColumns": [{
    "name": "dropoff_location",
    "longitude": "dropoff_longitude",
    "latitude": "dropoff_latitude"
  }, {
    "name": "pickup_location",
    "longitude": "pickup_longitude",
    "latitude": "dropoff_latitude"
  }],
  "createdAt": "2016-04-29T22:50:03.108Z"
}
```

### Dataset Groups API

- Get Dataset Groups object by id: `/datasetGroups/:datasetGroupsId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/datasetGroups/5738c32843c3534890f859dd
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Returns a Dataset Groups object for the dataset group with id `:datasetGroupsId`.

    ```json
    {
      "joinSchemasClusters": [[{
        "dataset1": "trip_data",
        "dataset2": "trip_fare",
        "joinFields": [{
          "dataset1Field": "medallion",
          "dataset2Field": "medallion"
        }, {
          "dataset1Field": "pickup_datetime",
          "dataset2Field": "pickup_datetime"
        }]
      }]],
      "id": "5738c32843c3534890f859dd",
      "datasetsIds": ["trip_data", "trip_fare"],
      "createdAt": "2016-05-15T18:42:48.848Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Create a new Dataset Groups object: `POST /datasetGroups`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetAttributes \
        --data '{
          "datasetsIds": ["trip_data", "trip_fare"], 
          "joinSchemasClusters": 
            [
              [
                {
                  "dataset1": "trip_data",
                  "dataset2": "trip_fare",
                  "joinFields": [
                    {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                    {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}
                  ]
                }
              ]
            ],
          "ownerId": "567595de37bab64e38c7b8fb"
        }'
    ```

    **Arguments**: Dataset Groups object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Creates a new Dataset Groups and returns it.

    ```json
    {
      "joinSchemasClusters": [[{
        "dataset1": "trip_data",
        "dataset2": "trip_fare",
        "joinFields": [{
          "dataset1Field": "medallion",
          "dataset2Field": "medallion"
        }, {
          "dataset1Field": "pickup_datetime",
          "dataset2Field": "pickup_datetime"
        }]
      }]],
      "id": "5738c32843c3534890f859dd",
      "datasetsIds": ["trip_data", "trip_fare"],
      "createdAt": "2016-05-15T18:42:48.848Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Update an existing Dataset Groups: `PUT /datasetGroups/:datasetGroupsId`. You need to pass only those parameters of a `Dataset Groups` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetGroups/5738c32843c3534890f859dd \
        --data '{"datasetsIds": ["trip_data", "trip_fare", "airlines"]}'
    ```

    **Arguments**: Dataset Groups update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing Dataset Groups. Updated Dataset Attributes is returened.

    ```json
    {
      "joinSchemasClusters": [[{
        "dataset1": "trip_data",
        "dataset2": "trip_fare",
        "joinFields": [{
          "dataset1Field": "medallion",
          "dataset2Field": "medallion"
        }, {
          "dataset1Field": "pickup_datetime",
          "dataset2Field": "pickup_datetime"
        }]
      }]],
      "updatedAt": "2016-05-15T18:47:58.918Z",
      "id": "5738c32843c3534890f859dd",
      "datasetsIds": ["airlines", "trip_data", "trip_fare"],
      "createdAt": "2016-05-15T18:42:48.848Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Delete an existing Dataset Groups object: `DELETE /datasetGroups/:datasetGroupsId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetGroups/5738c32843c3534890f859dd
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
- List Dataset Groups objects: `GET /datasetGroups`
    
    ```bash
    curl -v -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/datasetGroups
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of Dataset Groups objects.

    ```json
    {
      "datasetGroups": [{
        "joinSchemasClusters": [[{
          "dataset1": "trip_data",
          "dataset2": "trip_fare",
          "joinFields": [{
            "dataset1Field": "medallion",
            "dataset2Field": "medallion"
          }, {
            "dataset1Field": "pickup_datetime",
            "dataset2Field": "pickup_datetime"
          }]
        }]],
        "id": "5738c49b43c3534890f859de",
        "datasetsIds": ["trip_data", "trip_fare"],
        "createdAt": "2016-05-15T18:48:59.147Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      }]
    }
    ```
    
- Find Dataset Groups containing provided `datasetsIds` in `datasetsIds` list: `POST /datasetGroups/findByDatasetsIds`

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/datasetGroups/5738c32843c3534890f859dd \
            --data '{"datasetsIds": ["trip_fare"]}'
    ```
    
    **Arguments**: Object containing a list of `datasetsIds`.

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of Dataset Groups objects.

    ```json
    [{
      "joinSchemasClusters": [[{
        "dataset1": "trip_data",
        "dataset2": "trip_fare",
        "joinFields": [{
          "dataset1Field": "medallion",
          "dataset2Field": "medallion"
        }, {
          "dataset1Field": "pickup_datetime",
          "dataset2Field": "pickup_datetime"
        }]
      }]],
      "id": "5738c49b43c3534890f859de",
      "datasetsIds": ["trip_data", "trip_fare"],
      "createdAt": "2016-05-15T18:48:59.147Z",
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }]
    ```

### Apps API

- Get App object by id: `/app/:appId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/app/574ca15e43c353024ec7aa82
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.
     By default only SuperUsers can access this view.

    **Result**: Returns a App object with id `:appId`.

    ```json
    {
      "name": "testapp4",
      "components": [{
        "id": "1",
        "type": "viz",
        "position": {
          "sizeX": 10,
          "sizeY": 50,
          "row": 1,
          "column": 2
        }
      }, {
        "id": "2",
        "type": "control",
        "position": {
          "sizeX": 70,
          "sizeY": 100,
          "row": 2,
          "column": 4
        },
        "subtype": "timeline"
      }],
      "id": "574ca15e43c353024ec7aa82",
      "createdAt": "2016-05-30T20:23:58.091Z",
      "sharedWith": [{
        "user": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "permission": "write"
      }],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Create a new App object: `POST /app`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/app \
        --data '{
          "name": "testapp4", 
          "ownerId": "567595de37bab64e38c7b8fb", 
          "components": [
            {
              "id": "1",
              "type": "viz",
              "position": {"sizeX": 10, "sizeY": 50, "row": 1, "column": 2}
            }, {
              "id": "2",
              "type": "control", 
              "subtype": "timeline", 
              "position": {"sizeX": 70, "sizeY": 100, "row": 2, "column": 4}
            }],
          "sharedWith": [{"userId": "567595de37bab64e38c7b8fb", "permission": "write"}]
        }'
    ```

    **Arguments**: App object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. By default only SuperUsers can access this view.

    **Result**: Creates a new App and returns it.

    ```json
    {
      "name": "testapp4",
      "components": [{
        "id": "1",
        "type": "viz",
        "position": {
          "sizeX": 10,
          "sizeY": 50,
          "row": 1,
          "column": 2
        }
      }, {
        "id": "2",
        "type": "control",
        "position": {
          "sizeX": 70,
          "sizeY": 100,
          "row": 2,
          "column": 4
        },
        "subtype": "timeline"
      }],
      "id": "574ca15e43c353024ec7aa82",
      "createdAt": "2016-05-30T20:23:58.091Z",
      "sharedWith": [{
        "user": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "permission": "write"
      }],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Update an existing App: `PUT /app/:appId`. 
  You need to pass only those parameters of a `App` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/app/574ca15e43c353024ec7aa82 \
        --data '{"name": "newApp"}'
    ```

    **Arguments**: App update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing App. Updated App is returened.

    ```json
    {
      "name": "newApp",
      "updatedAt": "2016-05-30T20:37:45.856Z",
      "components": [{
        "id": "1",
        "type": "viz",
        "position": {
          "sizeX": 10,
          "sizeY": 50,
          "row": 1,
          "column": 2
        }
      }, {
        "id": "2",
        "type": "control",
        "position": {
          "sizeX": 70,
          "sizeY": 100,
          "row": 2,
          "column": 4
        },
        "subtype": "timeline"
      }],
      "id": "574ca15e43c353024ec7aa82",
      "createdAt": "2016-05-30T20:23:58.091Z",
      "sharedWith": [{
        "user": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "permission": "write"
      }],
      "owner": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Delete an existing App object: `DELETE /app/:appId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/app/574c9d4843c3537ca7b506d8
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
- List App objects: `GET /app`
    
    ```bash
    curl -v -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/app
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of App objects.

    ```json
    {
      "apps": [{
        "name": "testapp4",
        "components": [{
          "id": "1",
          "type": "viz",
          "position": {
            "sizeX": 10,
            "sizeY": 50,
            "row": 1,
            "column": 2
          }
        }, {
          "id": "2",
          "type": "control",
          "position": {
            "sizeX": 70,
            "sizeY": 100,
            "row": 2,
            "column": 4
          },
          "subtype": "timeline"
        }],
        "id": "574ca15e43c353024ec7aa82",
        "createdAt": "2016-05-30T20:23:58.091Z",
        "sharedWith": [{
          "user": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "permission": "write"
        }],
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      }]
    }
    ```
    
### AppsData API

- Get AppData object by id: `/appData/:appDataId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/appData/574ca15e43c353024ec7aa82
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.
     By default only SuperUsers can access this view.

    **Result**: Returns a AppData object with id `:appId`.

    ```json
    {
      "componentsData": [{
        "componentId": "1",
        "datasetId": "airlines",
        "vizId": "233dfdfj843984jf"
      }, {
        "componentId": "2",
        "datasetId": "trip_data",
        "operator": "<="
      }],
      "id": "574ce2f643c353067a6e9bfc",
      "createdAt": "2016-05-31T01:03:50.131Z",
      "app": {
        "name": "testapp4",
        "components": [{
          "id": "1",
          "type": "viz",
          "position": {
            "sizeX": 10,
            "sizeY": 50,
            "row": 1,
            "column": 2
          }
        }, {
          "id": "2",
          "type": "control",
          "position": {
            "sizeX": 70,
            "sizeY": 100,
            "row": 2,
            "column": 4
          },
          "subtype": "timeline"
        }],
        "id": "574cdd1343c353067a6e9bfb",
        "createdAt": "2016-05-31T00:38:43.892Z",
        "sharedWith": [{
          "user": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "permission": "write"
        }],
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      },
      "user": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Create a new AppData object: `POST /appData`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/appData \
        --data '{
          "appId": "574cdd1343c353067a6e9bfb",
          "userId": "567595de37bab64e38c7b8fb",
          "componentsData": [
            {"componentId": "1", "datasetId": "airlines", "vizId": "233dfdfj843984jf"},
            {"componentId": "2", "datasetId": "trip_data", "values": ["1", "2", "3", "4"], "operator": "<="}]
        }'
    ```

    **Arguments**: AppData object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. 
    
    **Result**: Creates a new AppData and returns it.

    ```json
    {
      "componentsData": [{
        "componentId": "1",
        "datasetId": "airlines",
        "vizId": "233dfdfj843984jf"
      }, {
        "componentId": "2",
        "datasetId": "trip_data",
        "operator": "<="
      }],
      "id": "574ce2f643c353067a6e9bfc",
      "createdAt": "2016-05-31T01:03:50.131Z",
      "app": {
        "name": "testapp4",
        "components": [{
          "id": "1",
          "type": "viz",
          "position": {
            "sizeX": 10,
            "sizeY": 50,
            "row": 1,
            "column": 2
          }
        }, {
          "id": "2",
          "type": "control",
          "position": {
            "sizeX": 70,
            "sizeY": 100,
            "row": 2,
            "column": 4
          },
          "subtype": "timeline"
        }],
        "id": "574cdd1343c353067a6e9bfb",
        "createdAt": "2016-05-31T00:38:43.892Z",
        "sharedWith": [{
          "user": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "permission": "write"
        }],
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      },
      "user": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Update an existing AppData: `PUT /appData/:appDataId`. 
  You need to pass only those parameters of a `AppData` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/appData/574ca15e43c353024ec7aa82 \
         --data '{
           "componentsData": [
             {"componentId": "1", "datasetId": "airlines", "vizId": "233dfdfj843984jf"}, 
             {"componentId": "2", "datasetId": "trip_data", "values": ["1"], "operator": "!="}
         ]}'
    ```

    **Arguments**: AppData update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing AppData. Updated AppData is returened.

    ```json
    {
      "updatedAt": "2016-05-31T01:18:50.931Z",
      "componentsData": [{
        "componentId": "1",
        "datasetId": "airlines",
        "vizId": "233dfdfj843984jf"
      }, {
        "componentId": "2",
        "datasetId": "trip_data",
        "operator": "!="
      }],
      "id": "574ce2f643c353067a6e9bfc",
      "createdAt": "2016-05-31T01:03:50.131Z",
      "app": {
        "name": "testapp4",
        "components": [{
          "id": "1",
          "type": "viz",
          "position": {
            "sizeX": 10,
            "sizeY": 50,
            "row": 1,
            "column": 2
          }
        }, {
          "id": "2",
          "type": "control",
          "position": {
            "sizeX": 70,
            "sizeY": 100,
            "row": 2,
            "column": 4
          },
          "subtype": "timeline"
        }],
        "id": "574cdd1343c353067a6e9bfb",
        "createdAt": "2016-05-31T00:38:43.892Z",
        "sharedWith": [{
          "user": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "permission": "write"
        }],
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      },
      "user": {
        "username": "superUser",
        "email": "another2@gmail.com",
        "groups": [{
          "name": "SuperUsers",
          "permissions": [],
          "id": "5675959437bab64e38c7b8fa",
          "createdAt": "2016-01-15T16:44:03.809Z"
        }],
        "id": "567595de37bab64e38c7b8fb"
      }
    }
    ```

- Delete an existing AppData object: `DELETE /appData/:appDataId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/appData/574c9d4843c3537ca7b506d8
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
- List AppData objects: `GET /appData`
    
    ```bash
    curl -v -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/appData
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of AppData objects.

    ```json
    {
      "appData": [{
        "componentsData": [{
          "componentId": "1",
          "datasetId": "airlines",
          "vizId": "233dfdfj843984jf"
        }, {
          "componentId": "2",
          "datasetId": "trip_data",
          "operator": "<="
        }],
        "id": "574ce2f643c353067a6e9bfc",
        "createdAt": "2016-05-31T01:03:50.131Z",
        "app": {
          "name": "testapp4",
          "components": [{
            "id": "1",
            "type": "viz",
            "position": {
              "sizeX": 10,
              "sizeY": 50,
              "row": 1,
              "column": 2
            }
          }, {
            "id": "2",
            "type": "control",
            "position": {
              "sizeX": 70,
              "sizeY": 100,
              "row": 2,
              "column": 4
            },
            "subtype": "timeline"
          }],
          "id": "574cdd1343c353067a6e9bfb",
          "createdAt": "2016-05-31T00:38:43.892Z",
          "sharedWith": [{
            "user": {
              "username": "superUser",
              "email": "another2@gmail.com",
              "groups": [{
                "name": "SuperUsers",
                "permissions": [],
                "id": "5675959437bab64e38c7b8fa",
                "createdAt": "2016-01-15T16:44:03.809Z"
              }],
              "id": "567595de37bab64e38c7b8fb"
            },
            "permission": "write"
          }],
          "owner": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          }
        },
        "user": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        }
      }]
    }
    ```

### Insights API

- Get Insights object by id: `/insights/:insightsId`

    ```bash
    curl -v -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
            http://localhost:8080/insights/5787fd7943c35363f8f7925b
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.
     By default only SuperUsers can access this view.

    **Result**: Returns an Insights object with id `:insightsId`.

    ```json
    {
      "vizs": [{
        "updatedAt": "2016-04-07T15:26:02.379Z",
        "yAxis": {
          "column": "arrdelay",
          "aggregation": "avg"
        },
        "colorPaletteDataColors": {
          "id": "56d6b3e0c246301416f1ea09",
          "colors": ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
          "createdAt": "2016-03-02T09:35:28.349Z"
        },
        "timeRange": {
          "type": "all",
          "filterColumn": "time"
        },
        "thumbnail": "57067c09c2463049a5904e05",
        "id": "57026213c2463049a5904dc2",
        "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
        "filters": [],
        "createdAt": "2016-04-04T12:46:11.784Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "line chart between avg @arrdelay and @dest",
        "type": "line",
        "xAxis": {
          "column": "dest",
          "resolution": "weekly"
        }
      }],
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "id": "5787fd7943c35363f8f7925b",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-07-14T21:00:41.466Z",
      "title": "Test Insights"
    }
    ```

- Create a new Insights object: `POST /insights`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/insights --data '{
          "title": "Test Insights", 
          "vizs": ["57026213c2463049a5904dc2"],
          "filters": [{"column": "money", "operator": ">=", "value": 100.0}], 
          "timeRange": {
            "type": "custom", 
            "from": "2013-12-31T21:00:00.000+03:00", 
            "to": "2016-12-31T12:00:00.000+03:00", 
            "filterColumn": "time"}, 
          "thumbnail": "p30r9kf9sd09dsfsdfsdf"}'
    ```

    **Arguments**: Insights object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user. 
    
    **Result**: Creates a new Insights and returns it.

    ```json
    {
      "vizs": [{
        "updatedAt": "2016-04-07T15:26:02.379Z",
        "yAxis": {
          "column": "arrdelay",
          "aggregation": "avg"
        },
        "colorPaletteDataColors": {
          "id": "56d6b3e0c246301416f1ea09",
          "colors": ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
          "createdAt": "2016-03-02T09:35:28.349Z"
        },
        "timeRange": {
          "type": "all",
          "filterColumn": "time"
        },
        "thumbnail": "57067c09c2463049a5904e05",
        "id": "57026213c2463049a5904dc2",
        "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
        "filters": [],
        "createdAt": "2016-04-04T12:46:11.784Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "line chart between avg @arrdelay and @dest",
        "type": "line",
        "xAxis": {
          "column": "dest",
          "resolution": "weekly"
        }
      }],
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "id": "5787fc7543c35363f8f7925a",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-07-14T20:56:21.933Z",
      "title": "Test Insights"
    }
    ```

- Update an existing Insights: `PUT /insights/:insightsId`. 
  You need to pass only those parameters of a `Insights` object you want to change.

    ```bash
    curl -v -X PUT -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/insights/5787fc7543c35363f8f7925a \
         --data '{"title": "Test Insights2"}'
    ```

    **Arguments**: Insights update object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Updates an existing Insights. Updated Insights is returened.

    ```json
    {
      "vizs": [{
        "updatedAt": "2016-04-07T15:26:02.379Z",
        "yAxis": {
          "column": "arrdelay",
          "aggregation": "avg"
        },
        "colorPaletteDataColors": {
          "id": "56d6b3e0c246301416f1ea09",
          "colors": ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
          "createdAt": "2016-03-02T09:35:28.349Z"
        },
        "timeRange": {
          "type": "all",
          "filterColumn": "time"
        },
        "thumbnail": "57067c09c2463049a5904e05",
        "id": "57026213c2463049a5904dc2",
        "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
        "filters": [],
        "createdAt": "2016-04-04T12:46:11.784Z",
        "owner": {
          "username": "superUser",
          "email": "another2@gmail.com",
          "groups": [{
            "name": "SuperUsers",
            "permissions": [],
            "id": "5675959437bab64e38c7b8fa",
            "createdAt": "2016-01-15T16:44:03.809Z"
          }],
          "id": "567595de37bab64e38c7b8fb"
        },
        "title": "line chart between avg @arrdelay and @dest",
        "type": "line",
        "xAxis": {
          "column": "dest",
          "resolution": "weekly"
        }
      }],
      "updatedAt": "2016-07-14T20:57:45.040Z",
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z",
        "filterColumn": "time"
      },
      "thumbnail": "p30r9kf9sd09dsfsdfsdf",
      "id": "5787fc7543c35363f8f7925a",
      "filters": [{
        "column": "money",
        "operator": ">=",
        "value": "100.0"
      }],
      "createdAt": "2016-07-14T20:56:21.933Z",
      "title": "Test Insights2"
    }
    ```

- Delete an existing Insights object: `DELETE /insights/:insightsId`.

    ```bash
    curl -v -X DELETE -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/insights/5787fd7943c35363f8f7925b
    ```

    **Arguments**: None

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Only status code is returned.
    
- List Insights objects: `GET /insights`
    
    ```bash
    curl -v -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/insights
    ```
    
    **Arguments**: *limit* and *offset* - standard pagination, both optional

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Returns a list of Insights objects.

    ```json
    {
      "insights": [{
        "vizs": [{
          "updatedAt": "2016-04-07T15:26:02.379Z",
          "yAxis": {
            "column": "arrdelay",
            "aggregation": "avg"
          },
          "colorPaletteDataColors": {
            "id": "56d6b3e0c246301416f1ea09",
            "colors": ["#E0F7FA", "#B2EBF4", "#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7", "#00808F", "#006064"],
            "createdAt": "2016-03-02T09:35:28.349Z"
          },
          "timeRange": {
            "type": "all",
            "filterColumn": "time"
          },
          "thumbnail": "57067c09c2463049a5904e05",
          "id": "57026213c2463049a5904dc2",
          "dataId": "f9c9aa39-5a13-4041-8caa-2e5c85eb938f",
          "filters": [],
          "createdAt": "2016-04-04T12:46:11.784Z",
          "owner": {
            "username": "superUser",
            "email": "another2@gmail.com",
            "groups": [{
              "name": "SuperUsers",
              "permissions": [],
              "id": "5675959437bab64e38c7b8fa",
              "createdAt": "2016-01-15T16:44:03.809Z"
            }],
            "id": "567595de37bab64e38c7b8fb"
          },
          "title": "line chart between avg @arrdelay and @dest",
          "type": "line",
          "xAxis": {
            "column": "dest",
            "resolution": "weekly"
          }
        }],
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z",
          "filterColumn": "time"
        },
        "thumbnail": "p30r9kf9sd09dsfsdfsdf",
        "id": "5787fc7543c35363f8f7925a",
        "filters": [{
          "column": "money",
          "operator": ">=",
          "value": "100.0"
        }],
        "createdAt": "2016-07-14T20:56:21.933Z",
        "title": "Test Insights"
      }]
    }
    ```

### Proxy

To proxy a request to the REST Backend Service, prefix its path with "proxy/" (e.g., if you're trying to send
POST request to `/ml/predict` endpoint, send it to ``/proxy/ml/predict` instead). You should not include "proxy/"
part in your REST permissions for users though.
You can use groups to manage access to its urls.


### Example of flow for creating a user with signup

```bash
# create a user via signup, get a token
curl -v -X POST -H "Content-Type: application/json" \
    http://localhost:8080/signup \
    --data '{"username": "newUser", "password": "barzoo", "email": "test@gmail.com"}'

# for existing user, you can login with his password to get the token:
curl -v -X POST -H "Content-Type: application/json" \
    http://localhost:8080/login \
    --data '{"username": "newUser", "password": "barzoo"}'

# change this user object using his token:
curl -v -X PUT -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
    http://localhost:8080/users/567595de37bab64e38c7b8fb \
    --data '{"password": "aNewPassword111"}'
```

### Example of managing permissions:

```bash
# using SuperUser token, create a new group that enables get access to /authtest on the connected backend service
curl -v -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
    http://localhost:8080/groups \
    --data '{"name": "authtest2Group", "permissions": [{"url": "authtest", "methods": ["GET"]}]}'

# now create a user within this group, using SuperUser's token
curl -v -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
    http://localhost:8080/users \
    --data '{"username": "authtestUser", "password": "testtest", "email": "another@gmail.com", "groupsIds": ["567596bf37bab64e38c7b8fc"]}'

# login as this user to gain his token
curl -v -X POST -H "Content-Type: application/json" \
    http://localhost:8080/login \
    --data '{"username": "authtestUser", "password": "testtest"}'

# using this user's token, access /authtest:
curl -v -H "Content-Type: application/json" \
    -H "Authorization: Bearer dsk45GcOd...p394biweI" \
    http://localhost:8080/authtest
```

### API Objects optionals and defaults

- Only Viz, VizPad, and DatasetDescription objects have optional fields. These fields can be missing from creation request's data.

- For Viz objects, the following fields are optional (default values provided in parentheses):
  - `x-axis-resolution` (no default)
  - `y-axis-aggregation` (`"sum"`)
  - `color-palette` (`"default"`)
  - `filters` (`[]`)
  - `time-range` (`{“type”: “all”}`)

- For VizPad:
  - `filters` (`[]`)
  - `time-range` (`{“type”: “all”}`)
  - `sharingByLink` (`false`)
  - `sharedWith` (`[]`)

- For DatasetDescription:
  - `hierarchies` (`[]`)

### Notes

`testtest` is a default SuperUser password in the db snapshot.

### Deploy instruction

To deploy to a new server, you need to make sure, that Java 8 is installed on this server.

After that, check that properties in your `application.conf` file are up to date (check `backend` and `mongo` objects!).

If everythong's ok, you can create a new distribution by invoking:

```bash
> sbt assembly
```

on your dev machine. Copy the resulting ``*.jar` to the server, and run it with:

```bash
java -jar tellius_middleware-assembly-1.0.jar
```

Done!

### How does it work

The app has several main structural components:

- In `Middleware.scala` file there are the main `route`, against which user request is matched.

- Together with the `route`, mongo connection variable, and such, in this file is also defined
`CheckAuthorization.check` method, which we use as a custom directive to check, if user has an access to the API method.

- To generate routes for most of our internal APIs we use a helper method `RestPathsGenerator.getPaths`. This method
accepts several type arguments, `authorizedDirective`, name of the common path for all routes, handler object for this routes,
and needed mongo collections objects.

- In `RestPathsGenerator` we use provided handler extending `RestHandlerLike[ModelType, CreateParams, UpdateParams]`. This is basically
just a collection of methods like `create`, `list`, etc., providing basic CRUD operations on `ModelType`, using `CreateParams` to
`create` new objects, and `UpdateParams` to `update` already existing ones.

  - To add `list` method together corresponding list route to our CRUD Handler, we need to specify, that it is extending not only `RestHandlerLike[ModelType, _, _]`,
    but also `RestHandlerListable[ModelType]`. Check line 58 in `RestPathGenerator.scala` to find out more.

- Handlers operate on models, i.e. types, extending `MongoModel[ModelType]`. `MongoModel[ModelType]` provides basic interface of all objects that we persist
in MongoDB. We also use `MongoModelUpdatable[ModelType]`, `MongoModelDeletable[ModelType]`, `MongoModelListable[ModelType]`, and `MongoModelListableWithParams[ModelType, ParamsType]`
to provide additional functionality depending on the model. For instance, `MongoModelListableWithParams[ModelType, ParamsType]` will create a parametrized list method,
that you can later use, for example, to return only VizPads that were created by this user, or all VizPads available to him depending on a url-parameter passed
(check out `list` method in `VizPadHandlers.scala`).

- Also note that `ThumbnailHandlers.scala` operate very differently from the other Handlers, since here we're using GridFS to store and fetch thumbnail files.

- Almost all the other files contain types needed to represent our domain. However, one important exception is `JsonImplicits.scala`.
This file is used to (de)serialize JSON requests and response via spray.json. Don't forget to provide implicits there for your own types.

- To understand how JWT encoding/decoding works, check out `JWTUtils`.


### `application.conf` custom params

All our application-specific settings are stored in `application.conf` file, in the object `middleware`. Here's what they do:

  - *interface* - to which interface to bind. By default we use "::0" to bind to all available interfaces.

  - *port* - on which port to listen

  - *backend.uri* - where to pass not matching requests (proxy functionality). Should be an address of our Rest backend.

  - *mongo* - apparently, mongoDB-related settings :)
    - *uri* - mongo uri
    - *dbName* - name of a db to use
    - *usersCollectionName*, *groupsCollectionName*, ... - names of corresponding collections in the db

  - *jwt.secret* - secret to encode JWT tokens with.