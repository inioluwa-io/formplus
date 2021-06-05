import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Template } from "../../types"
import { startCase, truncate } from "lodash"
const CardContainer = styled(Link)`
  display: block;
  text-align: left;
  background: #fff;
  box-shadow: 0px 4px 20px -8px #d0d0d0;
  border-radius: 3px;
  color: inherit;
  text-decoration: none;
  position:relative;
  padding-bottom:25px
  overflow:hidden;

  .container {
    padding: 20px;
  }

  .h2 {
    font-size: 1.45em;
    font-weight: 700;
  }

  .label {
    padding: 12px 20px;
    background: #f8f8f8;
    font-weight:500;
    position:absolute;
    bottom:0;
    width:calc(100% - 40px);
  }
`

/**
 * Creates a template card
 */
const Card: React.FC<Template> = ({ link, name, description }) => {
  return (
    <CardContainer to={link}>
      <div className="container">
        <p className="h2">{startCase(name)}</p>
        <p className="margin-y-sm">{truncate(description, { length: 120 })}</p>
      </div>

      <div className="label flex">
        <p className ="color-success">Use Template</p>
      </div>
    </CardContainer>
  )
}

export default Card
