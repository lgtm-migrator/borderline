

const unboltHook = (payload) => {
    return payload;
};

const boltHook = (payload) => {
    return JSON.stringify(payload);
};

export const bolt = boltHook;
export const unbolt = unboltHook;
