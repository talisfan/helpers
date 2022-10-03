import * as oauthControllers from '../controllers/oauthController';
import { validationParams } from '../middlewares/oauthMid';
import { Router } from 'express';
const router = Router();

// Login CodUser+Doc - PI SAP
router.post('/login/authorizationCode', 
    validationParams.getAuthorizationCode, 
    oauthControllers.getAuthorizationCode
);

router.post('/accessTokenExchenge', 
    validationParams.getAccessToken, 
    oauthControllers.getAccessToken
);

router.get('/getUserInfo', 
    validationParams.getUserInfo,
    oauthControllers.getUserInfo
);

export default router;