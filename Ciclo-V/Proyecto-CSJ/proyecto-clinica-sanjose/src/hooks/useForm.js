import { useEffect, useState } from 'react';

export const useForm = ( initialForm = {}, formValidations = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [formValidation, setFormValidation] = useState({});

    useEffect(() => {
      createValidators();

    }, [formState])

    useEffect(() => {
      setFormState(initialForm);
    
    }, [initialForm])
    
    

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = () => {
        const formCheckValues = {};

        for (const formField of Object.keys(formValidations)) {
            
            const validateFunc = formValidations[formField];
            formCheckValues[`${formField}Valid`] = validateFunc( formState[formField] ) && true;
        }

        setFormValidation( formCheckValues );

    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        ...formValidation
    }
}