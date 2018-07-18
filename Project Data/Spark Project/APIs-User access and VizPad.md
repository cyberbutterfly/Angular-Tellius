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
        --data '{"email": "aNewEmail@gmail.com"}'
    ```
    
    **Arguments**: Update user object
    
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
      "hierarchies": [["country", "area", "city"]],
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
                 "hierarchies": [["country", "area", "city"]]}'
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
      "hierarchies": [["country", "area", "city"]],
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
      "hierarchies": [["country", "area", "city"]],
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
        "dataId": "df1",
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T21:00Z",
          "to": "2016-12-31T12:00Z"
        },
        "thumbnail": "thumb1.jpg",
        "colorPalette": "cp1",
        "id": "567fe443ed93769158209c78",
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
        "title": "My first Viz",
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
            http://localhost:8080/viz/568152dced93764b90b1c18c
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
      "dataId": "df1",
      "timeRange": {
        "type": "custom",
        "from": "2013-12-31T18:00Z",
        "to": "2016-12-31T09:00Z"
      },
      "thumbnail": "thumb1.jpg",
      "colorPalette": "cp1",
      "id": "568152dced93764b90b1c18c",
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
      "title": "My second Viz",
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
          "colorPalette": "cp1",
          "filters": [{"column": "money", "operator": ">=", "value": 100.0}],
          "timeRange": {
            "type": "custom",
            "from": "2013-12-31T21:00:00.000+03:00",
            "to": "2016-12-31T12:00:00.000+03:00"
          },
          "thumbnail": "3242332sddsfsff3434"}'
    ```

    **Arguments**: Viz object

    **Headers**: Need to pass `Authorization: Bearer` header with a JWT token for a user.

    **Result**: Creates a new Viz object and returns it.

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
      "thumbnail": "3242332sddsfsff3434",
      "colorPalette": "cp1",
      "id": "56826e94ed93762f804815a5",
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
      "colorPalette": "cp1",
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
          "colorPalette": "cp1",
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
        "sharingByLink": true,
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
        "sharedWith": [],
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
        "dataId": "df1",
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z"
        },
        "thumbnail": "thumb1.jpg",
        "colorPalette": "cp1",
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
      "sharingByLink": true,
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
      "sharedWith": [],
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

- Create a new VizPad object: `POST /vizpad`.

    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciO...pUQXbeE1Q" \
        http://localhost:8080/vizpad \
        --data '{
          "ownerId": "567595de37bab64e38c7b8fb",
          "title": "My first VizPad",
          "vizs": ["56826daeed937674ac1c1544"],
          "layout": "{\"testLayoutProperty\": true}",
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
        "dataId": "df1",
        "timeRange": {
          "type": "custom",
          "from": "2013-12-31T18:00Z",
          "to": "2016-12-31T09:00Z"
        },
        "thumbnail": "thumb1.jpg",
        "colorPalette": "cp1",
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
      "sharingByLink": true,
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
      "sharedWith": [],
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
    }*
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
        "colorPalette": "cp1",
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


### Proxy

All requests not matching those defined above are proxied to the REST Backend Service. You can use groups to manage access to its urls.


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