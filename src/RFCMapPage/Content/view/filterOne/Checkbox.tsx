import { memo, useState } from 'react';
import { ICheckboxProps } from '../../../types'

const Checkbox = ({ name, label, checked, style, onChange }: ICheckboxProps) => {
  const [active, setActive] = useState(checked);

  const handleChange = (e: any) => {
    onChange({name: e.target.name, active: !active})
    setActive(!active)
  };

  return (
    <label>
      <input key={name} name={name} style={style} type="checkbox" checked={active} onChange={handleChange}/>
      {label}
    </label>
  );
};

export default memo(Checkbox)