import { useEffect, useState } from 'react';

function useInputValidation(initialState, nameRequired = true) {
  const [formData, setFormData] = useState(initialState);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const passwordRegex = /^[A-Za-z0-9]{6,12}$/;

    if ((nameRequired && !formData.name) || !formData.email || !formData.password) {
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage('이메일 양식을 확인해주세요');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setErrorMessage('비밀번호는 6~12자리의 알파벳 또는 숫자를 입력해주세요');
      return;
    }

    setErrorMessage('');
  }, [formData, nameRequired]);

  return [errorMessage, setErrorMessage, handleChange, formData];
}

export default useInputValidation;
