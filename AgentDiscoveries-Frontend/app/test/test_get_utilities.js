import chai from 'chai'
import React from 'react'
import * as utilities from "../src/components/utilities/get-utilities";

let expect = chai.expect;

describe("get utilities", () => {
  "use strict";

  it('should remove hashed passwords from results', () => {
    const users=[
      {"userName":"Bob", "hashedPassword":"asdasd"},
      {"userName":"Alice", "hashedPassword":123, "anotherField":"asb"}
    ];
    const expectedFilter=[
      {"userName":"Bob"},
      {"userName":"Alice", "anotherField":"asb"}
    ];
    const filteredUsers = utilities.filterResults(users);
    expect(filteredUsers).to.deep.equal(expectedFilter);
    const filteredBob = utilities.filterResult(users[0]);
    expect(filteredBob).to.deep.equal(expectedFilter[0]);
  });

  it('should do nothing if no hashedPassword is set',()=>{
    const user={"username":"Cat", "otherField":123};
    const filteredUser = utilities.filterResult(user);
    expect(filteredUser).to.deep.equal(user);
  })
});
