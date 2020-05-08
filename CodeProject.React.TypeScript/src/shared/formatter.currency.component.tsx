import React from "react";
import NumberFormat from "react-number-format";

interface IProps {
  inputRef: (ref: HTMLInputElement | null) => void;
  onChange: (event: any) => void;
  onFocus: (event: any) => void;
  onBlur: (event: any) => void;

  name: string;
  placeholder: string;
  value: number;
}

class FormatterCurrencyComponent extends React.Component<IProps> {
  onChange = this.props.onChange;
  onFocus = this.props.onFocus;
  onBlur = this.props.onBlur;

  render() {
    return (
      <NumberFormat
        getInputRef={this.props.inputRef}
        className="MuiInputBase-input MuiInputBase-label MuiInputBase-root MuiLabelBase-root MuiInputLabel-animated "
        style={{ border: "none" }}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onFocus={input => {
          this.onFocus({
            target: {
              name: this.props.name
            }
          });
        }}
        onBlur={input => {
          this.onBlur({
            target: {
              name: this.props.name
            }
          });
        }}
        onValueChange={input => {
          this.onChange({
            target: {
              value: input.value,
              name: this.props.name
            }
          });
        }}
        thousandSeparator
        prefix="$"
        decimalScale={2}
        fixedDecimalScale={true}
      />
    );
  }
}

export default FormatterCurrencyComponent;
