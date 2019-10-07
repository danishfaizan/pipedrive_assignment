The approach used for solving this problem is by saving the incoming JSON in two tables with the following sample format:-
```
Table 1 - organisations
                  id                  |       name        
--------------------------------------+-------------------
 bfbfaab1-4592-4793-8647-e59ab7870435 | Paradise Island
 f0d962dd-60b4-46ae-beb9-80f70c4957b9 | Banana tree
 a1cf77b8-c157-47e8-8ff5-1b925ddfafc8 | Yellow Banana
 60e258c0-bbba-4986-879c-27703546110f | Brown Banana
 579b140a-94b0-476e-87bf-573b0a666897 | Black Banana
 f8d899e2-e07d-472d-9cc5-c87ec671a06a | Big banana tree
 8605383a-a7e1-4e08-91f8-265acd78e193 | Green Banana
 4b92a30b-59c9-4fac-a755-ae8518133f61 | Phoneutria Spider
 
 Table 2 - organisation_relationships
  id |            organisationId            |               parentId               
----+--------------------------------------+--------------------------------------
 1  | bfbfaab1-4592-4793-8647-e59ab7870435 | 
 2  | f0d962dd-60b4-46ae-beb9-80f70c4957b9 | bfbfaab1-4592-4793-8647-e59ab7870435
 3  | a1cf77b8-c157-47e8-8ff5-1b925ddfafc8 | f0d962dd-60b4-46ae-beb9-80f70c4957b9
 4  | 60e258c0-bbba-4986-879c-27703546110f | f0d962dd-60b4-46ae-beb9-80f70c4957b9
 5  | 579b140a-94b0-476e-87bf-573b0a666897 | f0d962dd-60b4-46ae-beb9-80f70c4957b9
 6  | f8d899e2-e07d-472d-9cc5-c87ec671a06a | bfbfaab1-4592-4793-8647-e59ab7870435
 7  | a1cf77b8-c157-47e8-8ff5-1b925ddfafc8 | f8d899e2-e07d-472d-9cc5-c87ec671a06a
 8  | 60e258c0-bbba-4986-879c-27703546110f | f8d899e2-e07d-472d-9cc5-c87ec671a06a
 9  | 8605383a-a7e1-4e08-91f8-265acd78e193 | f8d899e2-e07d-472d-9cc5-c87ec671a06a
 10 | 579b140a-94b0-476e-87bf-573b0a666897 | f8d899e2-e07d-472d-9cc5-c87ec671a06a
 11 | 4b92a30b-59c9-4fac-a755-ae8518133f61 | 579b140a-94b0-476e-87bf-573b0a666897
```

The first table stores all the unique organisation names, whereas the second table stores the parent-child relationship
between the organisations. This will ensure that parents, daughters and sisters IDs can easily be found from the second
table. The two tables can be joined to figure out the organisation name corresponding to the IDs.

**Advantages**
1. Less space required in the database as we only store the parent relationship. 
2. Simple write operations

**Disadvantages**
1. Read operations can be simpler at the cost of space savings. If all three relationships (parent, sister, daughter) are stored in the database then read operations will become very
simple. But the trade-off in that case will be the extra storage required in the database. Therefore the current approach
takes a balanced view when weighing read, write and space required in the database.

### How to run the project:-
1. Navigate to the project folder and run
```
docker-compose up
```
2. POST: http://localhost:3000/api/organisations/

Example JSON body:-
```
{
    "org_name": "Paradise Island",
    "daughters": [
        {
            "org_name": "Banana tree",
            "daughters": [
                {
                    "org_name": "Yellow Banana"
                },
                {
                    "org_name": "Brown Banana"
                },
                {
                    "org_name": "Black Banana"
                }
            ]
        },
        {
            "org_name": "Big banana tree",
            "daughters": [
                {
                    "org_name": "Yellow Banana"
                },
                {
                    "org_name": "Brown Banana"
                },
                {
                    "org_name": "Green Banana"
                },
                {
                    "org_name": "Black Banana",
                    "daughters": [
                        {
                            "org_name": "Phoneutria Spider"
                        }
                    ]
                }
            ]
        }
    ]
}
```
3. GET: http://localhost:3000/api/organisations/?organisation_name=Black%20Banana&limit=10&page=1

Following is a sample response:-
```
[
    {
        "relationship_type": "parent",
        "org_name": "Banana tree"
    },
    {
        "relationship_type": "parent",
        "org_name": "Big banana tree"
    },
    {
        "relationship_type": "sister",
        "org_name": "Black Banana"
    },
    {
        "relationship_type": "sister",
        "org_name": "Brown Banana"
    },
    {
        "relationship_type": "sister",
        "org_name": "Green Banana"
    },
    {
        "relationship_type": "daughter",
        "org_name": "Phoneutria Spider"
    },
    {
        "relationship_type": "sister",
        "org_name": "Yellow Banana"
    }
]
```
