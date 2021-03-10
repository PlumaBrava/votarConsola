{
  "indexes": [
    {
      "collectionGroup": "AuxIdiomas",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "key",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "nombre",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "Monitoreo",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "mon_id_lote",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "mon_fecha",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "MovimientoCampania",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "usr_mail",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "est_nombre",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
