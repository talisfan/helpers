import validator from 'validator';

export function validatePassword(pass: string){
    const isValidPass = validator.isStrongPassword(pass, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
    });

    if (!isValidPass) {
        throw ({
            status: 400,
            message: "Insira uma senha mais forte",
        });
    }
}

export function safeSecurityDataUpdate<T extends Record<string, any>>(data: T): T {

    delete data.id;
    delete data.isActive;
    delete data.createdAt;
    delete data.updatedAt;
    // user fields
    delete data.role;
    delete data.access_token;
    delete data.refresh_token;
    delete data.codeResetPass;
    delete data.dateRequestResetPass;
    delete data.originAuth;
    delete data.facebookId;
    delete data.googleId;
    // partner fields    
    delete data.adminApproved;
    
    return data;
}

export function safeSecurityDataResponse<T extends Record<string, any>>(data: T): T {

    delete data.access_token;
    delete data.refresh_token;
    delete data.codeResetPass;
    delete data.dateRequestResetPass;
    delete data.originAuth;
    delete data.facebookId;
    delete data.googleId;
    
    return data;
}
