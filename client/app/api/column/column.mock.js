class columnAPI {
  constructor($q) {
    this.$q = $q;
  }

  getColumnStats() {
    return this.$q((resolve) => {
      resolve(
        {
          'count': 3375,
          'nonNullCount': 3375,
          'columnName': 'lat',
          'avg': 40.03873757087695,
          'min': 13.48345,
          'max': 9.5167,
          'uniqueValueCount': [
            {
              'lat': '38.98058333',
              'latcount': '1',
            },
            {
              'lat': '42.10690806',
              'latcount': '1',
            },
            {
              'lat': '38.54517861',
              'latcount': '1',
            },
            {
              'lat': '36.29553889',
              'latcount': '1',
            },
            {
              'lat': '55.90331972',
              'latcount': '1',
            },
            {
              'lat': '63.39387278',
              'latcount': '1',
            },
            {
              'lat': '39.00408444',
              'latcount': '1',
            },
            {
              'lat': '42.99026444',
              'latcount': '1',
            },
            {
              'lat': '40.78631889',
              'latcount': '1',
            },
            {
              'lat': '44.40966667',
              'latcount': '1',
            },
            {
              'lat': '43.08027611',
              'latcount': '1',
            },
            {
              'lat': '34.73002111',
              'latcount': '1',
            },
            {
              'lat': '37.25937778',
              'latcount': '1',
            },
          ],
          'sum': 135130.7393017097,
        }
      );
    });
  }
}

export default columnAPI;
