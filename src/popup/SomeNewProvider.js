import React, { useEffect, useState } from 'react';
import SomeNewContext from './SomeNewContext';

export default ({children}) => {
    const [mTest, setmTest] = useState('kapa');

    return <SomeNewContext.Provider value={{
        mTest, setmTest
    }}>
        {children}
    </SomeNewContext.Provider>
};
