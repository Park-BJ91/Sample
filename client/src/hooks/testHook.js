import React, { useState, useEffect } from 'react';


export function useTestHook(props) {

    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        console.log("status: " + status.isOnline);
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        const str = JSON.stringify(props);
        console.log("mount" + str);

        console.log("props.isOnline: " + props.isOnline);
        handleStatusChange(props);


        return () => {
            console.log("unmount" + props.id);
            handleStatusChange(props);

        }
    });

    return isOnline;
}