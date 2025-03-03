import React from "react";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

interface ISelect {
  disabled?: boolean;
  label: string;
  //eslint-disable-next-line
  options: Record<string, any>[];
  //eslint-disable-next-line
  onChange: (value: Record<string, any>) => void;
  value: string;
}

const animatedComponents = makeAnimated();

const Select: React.FC<ISelect> = ({
  disabled,
  label,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          components={animatedComponents}
          isMulti
          isDisabled={disabled}
          name="Members"
          placeholder="Add Members"
          onChange={onChange}
          options={options}
          closeMenuOnSelect={false}
          closeMenuOnScroll={true}
          className="basic-multi-select"
          classNamePrefix="select"
          value={value}
          noOptionsMessage={() => <h1>damn,isnt that much Members enough!</h1>}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
