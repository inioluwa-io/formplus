import React from "react"
import { render } from "@testing-library/react"
import App from "../App"
import Enzyme, { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import "jest-enzyme"
import "jest-styled-components"

Enzyme.configure({ adapter: new Adapter() })

describe("He", () => {
  it("Should render home page", () => {
    shallow(<App />);
  });
})
