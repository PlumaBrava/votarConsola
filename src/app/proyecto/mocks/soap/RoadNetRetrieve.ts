import { xmlRetrieveEquipmentTypesByCriteria }      from './RetrieveEquipmentTypesByCriteria'
import { xmlRetrieveEquipmentByCriteria }           from './RetrieveEquipmentByCriteria'

import { xmlRetrieveEmployeesByCriteriaEx }         from './RetrieveEmployeesByCriteriaEx'
import { xmlRetrieveEmployeesTypesByCriteriaEx }    from './RetrieveEmployeesTypesByCriteriaEx'

import { xmlRetrieveRoutingSessionsByCriteria }     from './RetrieveRoutingSessionsByCriteria'

import { xmlRetrieveLocationsByCriteriaEx }         from './RetrieveLocationsByCriteriaEx'
import { xmlRetrieveLocationTypesByCriteriaEx }     from './RetrieveLocationsTypesByCriteriaEx'
import { xmlRetrieveAccountTypesByCriteriaEx }      from './RetrieveAccountTypesByCriteriaEx'
import { xmlRetrieveRoutingLocationsWithOrdersEx }  from './RetrieveRoutingLocationsWithOrdersEx'

import { xmlRetrieveRoutingRoutesByCriteria }       from './RetrieveRoutingRoutesByCriteria'


export function getSoapAction(method:string):string {
  
  let soapAction:any[]=[];
  
  // Vehículos
  soapAction['RetrieveEquipmentByCriteria']         = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveEquipmentByCriteriaRequest';  
  soapAction['RetrieveEquipmentTypesByCriteria']    = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveEquipmentTypesByCriteriaRequest';  
  
  // Empleados (Usuarios-Choferes)
  soapAction['RetrieveEmployeesByCriteriaEx']       = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveEmployeesByCriteriaExRequest';  
  soapAction['RetrieveEmployeesTypesByCriteriaEx']  = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveEmployeeTypesByCriteriaExRequest';  
  
  // Sessiones
  soapAction['RetrieveRoutingSessionsByCriteria']   = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveRoutingSessionsByCriteriaRequest';  
  
  // Locations (Ubicaciones)
  soapAction['RetrieveLocationsByCriteriaEx']       = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveLocationsByCriteriaExRequest';  
  soapAction['RetrieveLocationTypesByCriteriaEx']   = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveLocationTypesByCriteriaExRequest';  
  soapAction['RetrieveAccountTypesByCriteriaEx']    = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveAccountTypesByCriteriaExRequest';    
  soapAction['RetrieveRoutingLocationsWithOrdersEx']= 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveRoutingLocationsWithOrdersExRequest';  
  
  // Rutas
  soapAction['RetrieveRoutingRoutesByCriteria']     = 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveRoutingRoutesByCriteriaRequest';  
  
  
  return soapAction[method];
}

export function getSoapXML(method:string):string {
  
  let soapXML:any[]=[
    'RetrieveEquipmentByCriteria',
    'RetrieveEquipmentTypesByCriteria',    
    
    'RetrieveEmployeesByCriteriaEx',
    'RetrieveEmployeesTypesByCriteriaEx',    
    
    'RetrieveRoutingSessionsByCriteria', 
    
    'RetrieveLocationsByCriteriaEx',
    'RetrieveLocationTypesByCriteriaEx',
    'RetrieveAccountTypesByCriteriaEx',
    'RetrieveRoutingLocationsWithOrdersEx',
    
    'RetrieveRoutingRoutesByCriteria'
  ];  
  
  // Vehículos
  soapXML['RetrieveEquipmentByCriteria']=xmlRetrieveEquipmentByCriteria;
  soapXML['RetrieveEquipmentTypesByCriteria']=xmlRetrieveEquipmentTypesByCriteria;
  
  // Empleados (Usuarios-Choferes)
  soapXML['RetrieveEmployeesByCriteriaEx']=xmlRetrieveEmployeesByCriteriaEx;
  soapXML['RetrieveEmployeesTypesByCriteriaEx']=xmlRetrieveEmployeesTypesByCriteriaEx;  
  
  // Sessiones
  soapXML['RetrieveRoutingSessionsByCriteria']=xmlRetrieveRoutingSessionsByCriteria;

  // Locations (Ubicaciones)
  soapXML['RetrieveLocationsByCriteriaEx']=xmlRetrieveLocationsByCriteriaEx;
  soapXML['RetrieveLocationTypesByCriteriaEx']=xmlRetrieveLocationTypesByCriteriaEx;  
  soapXML['RetrieveAccountTypesByCriteriaEx']=xmlRetrieveAccountTypesByCriteriaEx;    
  soapXML['RetrieveRoutingLocationsWithOrdersEx']=xmlRetrieveRoutingLocationsWithOrdersEx;
  
  // Rutas
  soapXML['RetrieveRoutingRoutesByCriteria']=xmlRetrieveRoutingRoutesByCriteria;
    
  return soapXML[method];
}




