export const xmlRetrieveAccountTypesByCriteriaEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveAccountTypesByCriteriaEx>
         <!--Optional:-->
         <tran:criteria>
            <!--type: string-->
            <tran:regionId>((SUCURSAL))</tran:regionId>
            <!--Optional:-->
            <!--type: string-->
            <tran:accountTypeId></tran:accountTypeId>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
         </tran:options>
      </tran:RetrieveAccountTypesByCriteriaEx>
   </soapenv:Body>
</soapenv:Envelope>`;
