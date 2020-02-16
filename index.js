const request = require('request');

const GIMME_PROXY_API_URL = 'https://gimmeproxy.com/api/getProxy?protocol=http&maxCheckPeriod=36000&get=true';
const PROXY_REUSE_TIMES = 6;
const GIMME_API_KEY = '41951938-3877-4be1-81d9-2daa2bca8fc5';

const MAX_DAILY_PROXIES = 240;
const fName = './proxies_list.json';
const GIMME_PROXIES = [];

class Listener {

  constructor() {
    this.readProxiesFile().then(
      res => GIMME_PROXIES = res,
      err => {throw new Error(err)}
    )

  }

  getProxyFromGimmy() {
    return new Promise((resolve, reject) => {
      const opts = {
        url: GIMME_PROXY_API_URL,
        method: 'GET',
        qs: {
          api_key: GIMME_API_KEY,
          protocol: 'http',
          maxCheckPeriod: 36000,
          get: true,
          post: true,
          cookies: true,
        },
      };
      request(opts, (err, response, body) => {
        if (err) return reject(err);
        else resolve(body);
      })
    });
  }

  readProxiesFile() {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.stat(fName, (err, res) => {
        if (err && err.code === 'ENOENT') {
          fs.writeFile(fName, '[]', (err, res) => {
            return err ? reject(err) : resolve(res);
          })
        } else return resolve(require(fName));
      })
    });
  }

  saveProxyToFile({protocol, ip, port}, ) {
    return new Promise((resolve, reject) => {
      const proxy = {protocol, ip, port};
      GIMME_PROXIES.push(proxy);
      fs.writeFile(fName, JSON.stringify(GIMME_PROXIES), (err, res) => {
        return err ? reject(err) : resolve(res);
      })
    });
  }
}

module.exports = new Listener();