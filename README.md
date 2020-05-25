# A web application to Review Restaurants

- User must be able to create an account and log in.
- Implement 3 roles with different permission levels
  <br/>~ Regular User: Can rate and leave a comment for a restaurant
  <br/>~ Owner: Can create restaurants and reply to comments about owned restaurants
  <br/>~ Admin: Can edit/delete all users, restaurants, comments, and reviews
- Reviews should have:
  <br/>~ A 5 star based rating
  <br/>~ Date of the visit
  <br/>~ Comment
- When a Regular User logs in, they will see a Restaurant List ordered by Average Rating
- When an Owner logs in, they will see a Restaurant List - only the ones owned by them, and the reviews pending reply
- Owners can reply to each review once
- Restaurants detailed view should have:
  <br/>~ The overall average rating
  <br/>~ The highest rated review
  <br/>~ The lowest rated review
  <br/>~ Last reviews with rate, comment, and reply
- Restaurant List can be filtered by Rating
- REST API. Make it possible to perform all user actions via the API, including authentication
- In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
- If it’s a web application, it must be a single-page application. All actions need to be done client-side using AJAX, refreshing the page is not acceptable.
- Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.
- Bonus: unit and e2e tests.
