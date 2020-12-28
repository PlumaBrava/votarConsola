export const xmlRetrieveLocationsByCriteriaEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveLocationsByCriteriaEx>
         <!--Optional:-->
         <tran:criteria>
            <!--Optional:-->
            <!--type: string-->
            <tran:regionID>((SUCURSAL))</tran:regionID>
            <!--Optional:-->
            <!--type: string-->
            <tran:locationType></tran:locationType>
            <!--Optional:-->
            <!--type: string-->
            <tran:locationID>((LOCATIONID))</tran:locationID>
            <!--Optional:-->
            <!--type: string-->
            <tran:description>((DESCRIPCION))</tran:description>
            <!--Optional:-->
            <!--type: string-->
            <tran:employeeID></tran:employeeID>
            <!--Optional:-->
            <!--type: date-->
            <tran:modifiedSince></tran:modifiedSince>
            <!--Optional:-->
            <!--type: date-->
            <tran:lastOrderDateFrom>((FECHA_DESDE))</tran:lastOrderDateFrom>
            <!--Optional:-->
            <!--type: date-->
            <tran:lastOrderDateTo>((FECHA_HASTA))</tran:lastOrderDateTo>
            <!--type: int-->
            <tran:maximumLocationsRetrieved>100</tran:maximumLocationsRetrieved>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
            <!--type: boolean-->
            <tran:retrieveConsigneeHistory>false</tran:retrieveConsigneeHistory>
            <!--type: boolean-->
            <tran:retrieveTimeWindowOverrides>false</tran:retrieveTimeWindowOverrides>
            <!--type: boolean-->
            <tran:retrieveServiceTimeOverrides>false</tran:retrieveServiceTimeOverrides>
            <!--type: boolean-->
            <tran:retrieveLocationPreferences>false</tran:retrieveLocationPreferences>
            <!--type: boolean-->
            <tran:retrieveActiveAlerts>false</tran:retrieveActiveAlerts>
            <!--type: boolean-->
            <tran:retrieveLocationEquipmentTypes>false</tran:retrieveLocationEquipmentTypes>
            <!--type: boolean-->
            <tran:retrieveEmployeeAssignments>false</tran:retrieveEmployeeAssignments>
         </tran:options>
      </tran:RetrieveLocationsByCriteriaEx>
   </soapenv:Body>
</soapenv:Envelope>`;
