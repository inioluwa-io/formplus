import React from "react"
import { render } from "@testing-library/react"
import App from "./App"
import Enzyme, { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({ adapter: new Adapter() })

describe("He", () => {
  it("should render", () => {})
})
