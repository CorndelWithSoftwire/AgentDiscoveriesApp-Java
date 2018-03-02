import chai from 'chai'
import React from 'react'
import * as utilities from "../src/components/utilities/submit-utilities";

let expect = chai.expect;

describe("submit utilities", () => {
  "use strict";

  it('should reduce non-location data to Json form', () => {
    const aValue = "some value";
    const submitForm = {"notLocation": {value: aValue}};
    expect(utilities.getBodyJSON(submitForm)).to.deep.equal({"notLocation": aValue});
  });

  it('should separate locations into series of integers', () => {
    const aValue = "10 2 14";
    const submitForm = {"locations": {value: aValue}};
    expect(utilities.getBodyJSON(submitForm)).to.deep.equal({"locations": [10, 2, 14]});
  });

  it('should transform admin-key value to true if on',()=>{
    const submitAdmin = {"admin": {value: "on"}};
    const submitNonAdmin = {"admin": {value: "something else"}};
    expect(utilities.getBodyJSON(submitAdmin)).to.deep.equal({"admin":true});
    expect(utilities.getBodyJSON(submitNonAdmin)).to.deep.equal({"admin":false});
  })

  it('should be able to combine these with multiple fields', () => {
    const submitForm = {
      "notLocation": {value: "someValue"},
      "name": {value: ""},
      "locations": {value: "17 12 41 1"},
      "admin": {value: "on"}
    };
    const expectedResponse = {
      "notLocation": "someValue",
      "name": "",
      "locations": [17, 12, 41, 1],
      "admin": true
    };
    expect(utilities.getBodyJSON(submitForm)).to.deep.equal(expectedResponse);

  })
});
