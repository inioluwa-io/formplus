import React from "react"
import { render } from "@testing-library/react"
import App from "../App"
import Home, { Pagination } from "../pages/home"
import { Input } from "../components"
import Enzyme, { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import "jest-enzyme"

Enzyme.configure({ adapter: new Adapter() })

afterEach(() => {
  jest.clearAllMocks()
})

describe("App tests", () => {
  it("should mount app", () => {
    shallow(<App />)
  })
})

describe("Input tests", () => {
  const mockFunction = jest.fn()
  const wrapper = mount(<Input onInputChange={mockFunction} />)

  it("should parse the right value return right input value", () => {
    // Test before event
    expect(mockFunction).not.toHaveBeenCalled()

    wrapper.find("input").simulate("change", { target: { value: "Hello" } })
    expect(wrapper.find("input")).toHaveValue("Hello")

    expect(mockFunction.mock.calls[0][0]).toEqual("Hello")
  })
})