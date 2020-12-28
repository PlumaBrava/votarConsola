export const xmlRetrieveLocationTypesByCriteriaEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveLocationTypesByCriteriaEx>
         <!--Optional:-->
         <tran:criteria>
            <!--type: string-->
            <tran:regionId>((SUCURSAL))</tran:regionId>
            <!--Optional:-->
            <!--type: string-->
            <tran:locationTypeId></tran:locationTypeId>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
         </tran:options>
      </tran:RetrieveLocationTypesByCriteriaEx>
   </soapenv:Body>
</soapenv:Envelope>`;
