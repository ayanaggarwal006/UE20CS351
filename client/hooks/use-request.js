import axios from "axios";
import { useState } from "react";

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      setErrors(
        <div className="">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((err) => (
              <li className="bg-red-200  text-red-600" key={err.message}>
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
