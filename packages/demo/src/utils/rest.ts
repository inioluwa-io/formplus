import { Template } from "./../types"

const mock: Template[] = [
  {
    name: "Blood donation form template",
    created: "2020-11",
    category: ["Health"],
    description: "Testing template",
    link: "",
  },
  {
    name: "donation form template",
    created: "2020-11",
    category: ["Health"],
    description: "Testing template",
    link: "",
  },
  {
    name: "Education form template",
    created: "2020-11",
    category: ["Education"],
    description: "Testing template",
    link: "",
  },
  {
    name: "E-commerce form template",
    created: "2020-11",
    category: ["E-commerce"],
    description: "Testing template",
    link: "",
  },
]
export const getTemplates = async (): Promise<Template[]> =>
  Promise.resolve(mock)
