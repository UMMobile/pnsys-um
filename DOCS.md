# pnsys v0.0.0

API for send push notifications

- [Analytic](#analytic)
	- [Register a new user event](#register-a-new-user-event)
	- [Retrieve analytic](#retrieve-analytic)
	- [Retrieve analytics](#retrieve-analytics)
	
- [Notification](#notification)
	- [Cancel schedule notification](#cancel-schedule-notification)
	- [Create notification](#create-notification)
	- [Retrieve notification](#retrieve-notification)
	- [Retrieve notifications](#retrieve-notifications)
	


# Analytic

## Register a new user event



	POST /analytics


## Retrieve analytic



	GET /analytics/:id


## Retrieve analytics



	GET /analytics


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

# Notification

## Cancel schedule notification



	DELETE /notifications/:id


## Create notification



	POST /notifications


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| message			| 			|  <p>Notification's message.</p>							|
| options			| 			|  <p>Notification's options.</p>							|

## Retrieve notification



	GET /notifications/:id


## Retrieve notifications



	GET /notifications


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|


