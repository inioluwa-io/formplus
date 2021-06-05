import React, { useState, useCallback, useRef, useEffect } from "react"
import { SelectComponent } from "../../types"
import styled from "styled-components"
import { Icon } from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"

const InputElement: any = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  height: fit-content;
  width: 150px;
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
  height: calc(100% - (${(props: any) => `${props.size} + ${props.size})`});
  flex: 1;
  font-size: 14px; 
  font-family: inherit;
  width: 100%;
  outline: none;
  padding: ${(props: any) => props.size};
  border-radius: 4px;
  border: 1px solid #ccc;
  background: transparent;
  padding-right:33px;
  padding-left:25px;
  color: ${(props: any) => props.textColor};
  transition: border 0.35s;

  &::placeholder,&.fade{
    color: #ccc;
    font-weight: montserrat;
    border-radius: 4px;
    border-bottom-left-radius:0;
    border-bottom-right-radius:0;
  }

  &:hover,&:focus{
    border: 1px solid ${(props: any) => props.color};
  }

  &:hover + div svg path,&:focus + div svg path{
    fill: ${(props: any) => props.color} !important;
  }

`

const Label: any = styled.label`
  font-size: 0.7rem;
  font-family: inherit;
  left: 25px;
  top: -9px;
  z-index: 1;
  position: absolute;
  background: #fcfcfc;
  padding: 3px;
  color: #999;
`

const ArrowDown: any = styled.div`
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

  svg path {
    transition: all 0.35s;
  }
`
const SuggestionContainer: any = styled.div`
  width: 100%;
  //   box-shadow: 0 0 15px -12px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: calc(100% - 2px);
  top: 100%;
  max-height: 150px;
  position: absolute;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow: auto;
  z-index: 99;
  background: ${(props: any) => props.background};
  border: 1px solid ${(props: any) => props.color};

  button {
    background: transparent;
    border: none;
    border-radius: 0;
    display: block;
    width: 100%;
    outline: none;
    cursor: pointer;
    padding: 9px 15px;
    text-align: left;
    transition: background 0.25s ease, color 0.25s ease;

    &:hover,
    &.active,
    &:focus {
      background: ${(props: any) => props.color};
      color: #f4f4f4;

      span {
        transition: color 0.25s ease;
        color: #f4f4f4;
      }
    }
  }
`

/**
 *
 * Creates a select component
 */

const Select: React.FC<SelectComponent> = ({
  id,
  label = "",
  disabled = false,
  placeholder,
  corners = "box",
  defaultSelected = "",
  size = "sm",
  options = [],
  color = "#222",
  onInputSelect,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>("")
  const [selectedValue, setSelectedValue] = useState<string>(defaultSelected)
  const [labelColor, setLabelColor] = useState<string>("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const refs: any = useRef()

  const getBorderRadius = (): string => {
    switch (corners) {
      case "rounded": {
        return "50px"
      }
      case "box": {
        return "9px"
      }
      default: {
        throw new Error("corners not supported")
      }
    }
  }

  const handleBlurEvent = (e: any): void => {
    e.target.classList.remove("fade")
    setLabelColor("")
  }

  const handleChangeEvent = (e: any) => {
    setInputValue(e.target.value)
  }

  useEffect(() => {
    setInputValue(selectedValue)
    if (typeof onInputSelect === "function") {
      onInputSelect(selectedValue)
    }
  }, [selectedValue, onInputSelect])

  const getFilteredOptions = useCallback((): string[] => {
    if (inputValue.length < 1) {
      return options
    } else {
      return options.filter((option: any) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    }
  }, [inputValue, options])

  const closeSuggestions = useCallback(
    e => {
      {
        const DOMNode = refs.current
        const suggestionElement = DOMNode.querySelector(".sugst")
        const inputElement = DOMNode.querySelector("input")

        if (suggestionElement) {
          if (
            !suggestionElement.contains(e.target) &&
            !inputElement.contains(e.target)
          ) {
            setShowSuggestions(false)
            selectedValue.length > 0
              ? setInputValue(selectedValue)
              : setInputValue("")
          }
        }
      }
    },
    [refs, selectedValue]
  )
  const handleEsc = useCallback(
    (e: any) => {
      const DOMNode = refs.current
      const inputElement: HTMLElement = DOMNode.querySelector("input")

      if (e.which === 27 || e.keyCode === 27 || e.code === "Escape") {
        setShowSuggestions(false)
        selectedValue.length > 0 && setInputValue(selectedValue)
        inputElement.blur()
      }
    },
    [refs, selectedValue]
  )

  useEffect(() => {
    window.addEventListener("click", closeSuggestions)
    window.addEventListener("keydown", handleEsc)
    return (): void => {
      window.removeEventListener("click", closeSuggestions)
      window.removeEventListener("keydown", handleEsc)
    }
  }, [closeSuggestions, handleEsc])

  return (
    <InputElement ref={refs} color={labelColor} labelColor={color} {...props}>
      {!!label.length && <Label htmlFor={`${id}`}>{label}</Label>}
      <InputContainer height={"37px"}>
        <InputHtmlElement
          background="#fcfcfc"
          color={color}
          textColor={"#111"}
          size={"12px"}
          type="text"
          id={id}
          value={inputValue}
          placeholder={selectedValue.length > 0 ? selectedValue : placeholder}
          disabled={disabled}
          onBlur={handleBlurEvent}
          onChange={handleChangeEvent}
          onFocus={(e: any) => {
            e.target.classList.add("fade")
            setLabelColor(color)
            setInputValue("")
            setShowSuggestions(true)
          }}
        />
        <ArrowDown>
          <Icon path={mdiChevronDown} size={0.8} color="#999" />
        </ArrowDown>
      </InputContainer>
      {showSuggestions && (
        <SuggestionContainer
          color={color}
          corners={getBorderRadius()}
          background="#fcfcfc"
          className="sugst"
        >
          <div>
            <button
              onClick={() => {
                setSelectedValue("")
                setShowSuggestions(false)
              }}
            >
              <span>...</span>
            </button>
            {getFilteredOptions().map((option, idx: number) => (
              <button
                key={idx}
                className={
                  option.toLowerCase() === selectedValue.toLowerCase()
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setSelectedValue(option)
                  setShowSuggestions(false)
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </SuggestionContainer>
      )}
    </InputElement>
  )
}
export default Select
