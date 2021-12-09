/**
 * Created by Wonseok Jung in KETI on 2021-12-09.
 */

// for TAS of mission

let mqtt = require('mqtt');
let fs = require('fs');
let my_msw_name = 'msw_lte_rc';
let util = require('util');

global.msw_mqtt_client = null;
let config = {};

global.libPort = 0;
global.libBaudrate = 0;

config.name = my_msw_name;

config.gcs = 'KETI_MUV';
config.drone = 'KETI_UAV_2';
config.lib = [{
    data: ['SBUS'],
    control: ['REMOTE', 'STATUS']
}];

let msw_sub_muv_topic = [];

let msw_sub_fc_topic = [];
msw_sub_fc_topic.push('/Mobius/' + config.gcs + '/Drone_Data/' + config.drone + '/heartbeat');
msw_sub_fc_topic.push('/Mobius/' + config.gcs + '/Drone_Data/' + config.drone + '/global_position_int');
msw_sub_fc_topic.push('/Mobius/' + config.gcs + '/Drone_Data/' + config.drone + '/attitude');
msw_sub_fc_topic.push('/Mobius/' + config.gcs + '/Drone_Data/' + config.drone + '/battery_status');

let msw_sub_lib_topic = [];
let remote_topic = '';
let status_topic = '';
remote_topic = '/Mobius/' + config.gcs + '/Mission_Data/' + config.drone + '/' + config.name + '/' + config.lib[0].control[0] + '/#';
status_topic = '/Mobius/' + config.gcs + '/Mission_Data/' + config.drone + '/' + config.name + '/' + config.lib[0].control[1] + '/#';

function init() {
    if (config.lib.length > 0) {
        for (let idx in config.lib) {
            if (config.lib.hasOwnProperty(idx)) {

                if (msw_mqtt_client != null) {
                    for (let i = 0; i < config.lib[idx].control.length; i++) {
                        let sub_container_name = config.lib[idx].control[i];
                        let _topic = '/Mobius/' + config.gcs + '/Mission_Data/' + config.drone + '/' + config.name + '/' + sub_container_name;
                        msw_mqtt_client.subscribe(_topic);
                        msw_sub_muv_topic.push(_topic);
                        console.log('[msw_mqtt] msw_sub_muv_topic[' + i + ']: ' + _topic);
                    }

                    for (let i = 0; i < config.lib[idx].data.length; i++) {
                        let container_name = config.lib[idx].data[i];
                        let _topic = '/MUV/data/' + config.lib[idx].name + '/' + container_name;
                        msw_mqtt_client.subscribe(_topic);
                        msw_sub_lib_topic.push(_topic);
                        console.log('[lib_mqtt] lib_topic[' + i + ']: ' + _topic);
                    }
                }

                let obj_lib = config.lib[idx];
                setTimeout(runLib, 1000 + parseInt(Math.random() * 10), JSON.parse(JSON.stringify(obj_lib)));
            }
        }
    }
}

function runLib(obj_lib) {
    try {
        let scripts_arr = obj_lib.scripts.split(' ');

        libPort = '/dev/ttyS0';
        libBaudrate = '115200';

        if (config.directory_name === '') {

        } else {
            scripts_arr[0] = scripts_arr[0].replace('./', '');
            scripts_arr[0] = './' + config.directory_name + '/' + scripts_arr[0];
        }

        require('./lib_lte_rc');
    } catch (e) {
        console.log(e.message);
    }
}

let msw_mqtt_client = null;

msw_mqtt_connect('localhost', 1883);

function msw_mqtt_connect(broker_ip, port) {
    if (msw_mqtt_client == null) {
        let connectOptions = {
            host: broker_ip,
            port: port,
            protocol: "mqtt",
            keepalive: 10,
            protocolId: "MQTT",
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 2000,
            connectTimeout: 2000,
            rejectUnauthorized: false
        };

        msw_mqtt_client = mqtt.connect(connectOptions);
    }

    msw_mqtt_client.on('connect', function () {
        console.log('[msw_mqtt_connect] connected to ' + broker_ip);
        for (idx in msw_sub_fc_topic) {
            if (msw_sub_fc_topic.hasOwnProperty(idx)) {
                msw_mqtt_client.subscribe(msw_sub_fc_topic[idx]);
                console.log('[msw_mqtt_connect] msw_sub_fc_topic[' + idx + ']: ' + msw_sub_fc_topic[idx]);
            }
        }
    });

    msw_mqtt_client.on('message', function (topic, message) {
        for (idx in msw_sub_lib_topic) {
            if (msw_sub_lib_topic.hasOwnProperty(idx)) {
                if (topic === msw_sub_lib_topic[idx]) {
                    setTimeout(on_receive_from_lib, parseInt(Math.random() * 5), topic, message.toString());
                    break;
                }
            }
        }

        for (idx in msw_sub_fc_topic) {
            if (msw_sub_fc_topic.hasOwnProperty(idx)) {
                if (topic === msw_sub_fc_topic[idx]) {
                    setTimeout(on_process_fc_data, parseInt(Math.random() * 5), topic, message.toString());
                    break;
                }
            }
        }

        if (topic === remote_topic) {
            on_receive_from_muv(topic, message.toString());
        }
    });

    msw_mqtt_client.on('error', function (err) {
        console.log(err.message);
    });
}

function on_receive_from_muv(topic, str_message) {
    // console.log('[' + topic + '] ' + str_message);

    parseControlMission(topic, str_message);
}

setTimeout(init, 1000);

function parseControlMission(topic, str_message) {
    try {
        // User define Code
        ///////////////////////////////////////////////////////////////////////

        let topic_arr = topic.split('/');
        let _topic = '/MUV/control/' + config.lib[0].name + '/' + topic_arr[topic_arr.length - 1];
        msw_mqtt_client.publish(_topic, str_message);
    } catch (e) {
        console.log('[parseControlMission] data format of MUV is not json');
    }
}

let MSW_mobius_mqtt_client = null;

MSW_mobius_mqtt_connect('203.253.128.177', 1883);

function MSW_mobius_mqtt_connect(broker_ip, port) {
    if (MSW_mobius_mqtt_client == null) {
        let connectOptions = {
            host: broker_ip,
            port: port,
            protocol: "mqtt",
            keepalive: 10,
            protocolId: "MQTT",
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 2000,
            connectTimeout: 2000,
            rejectUnauthorized: false
        };

        MSW_mobius_mqtt_client = mqtt.connect(connectOptions);
        MSW_mobius_mqtt_client.on('connect', function () {
            console.log('[msw_mobius_mqtt_connect] connected to ' + broker_ip);
            if (status_topic !== '') {
                MSW_mobius_mqtt_client.subscribe(status_topic);
                console.log('[msw_mobius_mqtt_subscribe] status_topic : ' + status_topic);
            }
            if (remote_topic !== '') {
                MSW_mobius_mqtt_client.subscribe(remote_topic);
                console.log('[msw_mobius_mqtt_subscribe] remote_topic : ' + remote_topic);
            }
        });

        MSW_mobius_mqtt_client.on('message', function (topic, message) {
            if (topic === remote_topic) {
                on_receive_from_muv(topic, message);
            }
        });

        MSW_mobius_mqtt_client.on('error', function (err) {
            console.log(err.message);
        });
    }
}
