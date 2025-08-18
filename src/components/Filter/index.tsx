import { ChangeEvent } from "react";

interface Props {
  type: string;
  onTypeChange: (type: string) => void;
}

export default function Filter({ type, onTypeChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  return (
    <div>
      <label>
        Тип:
        <select value={type} onChange={handleChange}>
          <option value="rent">Оренда</option>
          <option value="sale">Продаж</option>
        </select>
      </label>
    </div>
  );
}
