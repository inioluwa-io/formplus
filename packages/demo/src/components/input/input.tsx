import React, { useState, useEffect, useRef } from "react"
import { InputProps } from "../../types"
import styled from "styled-components"
import { Icon } from "@mdi/react"
import { mdiClose } from "@mdi/js"
import { darken } from "polished"

const InputElement: any = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  top: 0px;
  height: fit-content;
  // width: 180px;

  label {
    transition: color 0.35s ease;
    ${(props: any) => !!props.color.length && "color: " + props.color};
  }

  &:hover,
  &:focus {
    label {
      color: ${(props: any) => props.labelColor};
    }
  }
`
const InputContainer: any = styled.div`
  position: relative;
  height: ${(props: any) => props.height};
  width: 100%;
  display: flex;
`
const InputHtmlElement: any = styled.input`
  position: relative;
  height: calc(100% - (${(props: any) =>
    `${props.size} + ${props.size} + 1px)`});
  flex: 1;
  font-size: 13px; 
  font-family: inherit;
  width: 100%;
  outline: none;
  padding: ${(props: any) => props.size};
  border-radius: 4px;
  border: 1px solid #ccc;
  background: transparent;
  padding-left:${(props: any) =>
    props.padLeft && !props.iconRight && (props.iconBorder ? "45px" : "33px")};
  padding-right:${(props: any) => {
    if (props.padLeft && props.iconRight) {
      return "45px"
    } else if (props.padLeft && props.clearButton) {
      return "38px"
    }
  }};
  color: ${(props: any) => props.textColor} !important;
  transition: border 0.35s;

  &::placeholder{
    color: #ccc;
    font-weight: montserrat;
  }

  &:focus,
  &:hover:not(:disabled) {
    border: 1px solid ${(props: any) => props.color};

     + div svg path{
      transition: all 0.35s;
      fill: ${(props: any) => props.color + " !important"};
    }
  }
`

const Label: any = styled.label`
  font-size: 0.8rem;
  font-family: inherit;
  left: 10px;
  top: -10px;
  z-index: 1;
  position: absolute;
  background: #fcfcfc;
  padding: 3px;
  color: #999;
`

const InputIcon: any = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${(props: any) => (props.iconRight ? "auto" : "0")};
  right: ${(props: any) => (props.iconRight ? "0" : "auto")};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;

  ${(props: any) =>
    props.iconRight
      ? `border-left: 1px solid #666;
       padding: 0 8px 0 7px`
      : `border-right: 1px solid #666;
      padding: 0 9px 0 10px;`}
  border:${(props: any) => !props.iconBorder && "none"}

  svg path {
    transition: all 0.35s;
  }
`

const ClearButton: any = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  display: flex;
  border: none;
  outline: none;
  justify-content: center;
  align-items: center;
  z-index: 0;
  padding: 3px;
  cursor: pointer;
  border-radius: 50%;
  border: none;
  background: ${(props: any) => props.background};

  svg path {
    transition: all 0.35s;
  }
`

/**
 *
 * Creates an input element
 */

const Input: React.FC<InputProps> = ({
  id = "",
  label = "",
  type = "text",
  background = "",
  disabled = false,
  placeholder,
  corners = "box",
  defaultValue = "",
  size = "sm",
  color = "#596173",
  icon,
  onError,
  iconRight = false,
  iconBorder = true,
  onInputChange,
  validate = "",
  clearButton = false,
  successMessage = "Valid",
  errorMessage = "Invalid",
  ...props
}) => {
  if (typeof onInputChange !== "function") {
    throw new Error("Props onInputChange is required")
  }
  const [inputValue, setInputValue] = useState<string>(defaultValue)
  const [labelColor, setLabelColor] = useState<string>("")
  const refs: any = useRef()

  // Reduce margin if parent is a form control element
  useEffect(() => {
    setInputValue(defaultValue)
    if (!!validate.length) {
      const DOMNode = refs.current
      const parentNode = DOMNode.parentElement
      if (parentNode.classList.contains("rap-ui-form-control")) {
        DOMNode.style.marginBottom = "-19px"
      }
    }
    // onInputChange(defaultValue)
  }, [defaultValue, validate.length])

  const handleBlurEvent = (e: any): void => {
    setLabelColor("")
  }

  const handleChangeEvent = (e: any) => {
    setInputValue(e.target.value)
    onInputChange(e.target.value)
  }

  return (
    <InputElement
      ref={refs}
      inputType={type}
      color={labelColor}
      labelColor={color}
      {...props}
    >
      {!!label.length && <Label htmlFor={`${id}`}>{label}</Label>}
      <InputContainer height="37px">
        <InputHtmlElement
          padLeft={!!icon}
          corners="4px"
          background={"#fcfcfc"}
          color={color}
          textColor={"#111"}
          size="12px"
          type={type}
          id={id}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={handleBlurEvent}
          clearButton={clearButton}
          iconRight={iconRight && !clearButton}
          onChange={handleChangeEvent}
          iconBorder={iconBorder}
        />
        {icon && (
          <InputIcon
            iconRight={iconRight && !clearButton}
            iconBorder={iconBorder}
          >
            <Icon path={icon} size={0.72} color={"#999"} />
          </InputIcon>
        )}
        {clearButton && !!inputValue.length && (
          <ClearButton
            background={darken(0.07, "#fcfcfc")}
            iconRight={iconRight && !clearButton}
            iconBorder={iconBorder}
            onClick={(e: any) => {
              setInputValue("")
              onInputChange("")
              refs.current.querySelector("input").focus()
            }}
          >
            <Icon path={mdiClose} size={0.55} color={"#f4f4f4"} />
          </ClearButton>
        )}
      </InputContainer>
    </InputElement>
  )
}
export default Input
