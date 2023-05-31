import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite && payload.digit === "."){
        return {
          ...state,
          overwrite: false,
          currentOperand: "0.",
        };
      }
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }
      if ((state.currentOperand == null || state.previousOperand == null) && payload.digit === ".") {
        return {
          ...state,
          currentOperand: "0" + payload.digit,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.currentOperand == null && state.previousOperand != null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null && state.currentOperand != null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      )
        return state;
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);
  if (isNaN(current) || isNaN(previous)) return null;
  if (operation === "÷" && current === 0) return null;

  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
    default:
      return null;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integerPart, decimalPart] = operand.split(".");
  if (decimalPart == null)
    return INTEGER_FORMATTER.format(parseInt(integerPart));
  return `${INTEGER_FORMATTER.format(parseInt(integerPart))}.${decimalPart}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="parent">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
