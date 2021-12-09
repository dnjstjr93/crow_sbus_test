/**
 * Created by Wonseok, Jung in KETI on 2021-06-25.
 */

let mqtt = require('mqtt');
let fs = require('fs');
let SerialPort = require('serialport');
const Buffer = require("buffer");

let my_lib_name = 'lib_lte_rc';

let msw_dir_name = (my_lib_name.replace('lib', 'msw') + '_' + my_lib_name.replace('lib', 'msw'));

let sbusPort = null;

let sbusPortNum = libPort;
let sbusBaudrate = libBaudrate;

global.ch_min_val = 0; // 00 DF
global.ch_mid_val = 125; // 03 FF
global.ch_max_val = 255; // 07 1F

global.ch_gap = 20;
let RC_RATE = 0.64;
let SBUS_RATE = 1.6;

global.check_ch_num = 0;
global.check_ch_val = 0.0;

let TIMEOUT = 40;

// console.log('[ ' + drone_info.drone + ' ] RC_MAP_VALUE = \n', rc_map);

// let sbus_module_value = JSON.parse(fs.readFileSync('./' + msw_dir_name + '/sbus_module_value(pwm).json', 'utf8'));

function min_max_scaler(val) {
    let nor_val = (val - (-1)) / (1 - (-1));
    return Math.round(nor_val * (ch_max_val - ch_min_val) + ch_min_val);
}

function SBUS2RC(x) {
    return Math.round((x * 8 + 1 - 1000) * RC_RATE + 1500);
}

function RC2SBUS(x) {
    return Math.round(((x - 1500) * SBUS_RATE + 1000) / 8);
}

// function key_to_signal(joystick) {
//     // console.log(joystick);
//     ch1_target_val = SBUS2RC(min_max_scaler(joystick.ch1));
//     if (ch1_target_val > rc_map.rc1_max) {
//         ch1_target_val = rc_map.rc1_max;
//     } else if (ch1_target_val < rc_map.rc1_min) {
//         ch1_target_val = rc_map.rc1_min;
//     } else {
//     }
//
//     ch2_target_val = SBUS2RC(min_max_scaler(joystick.ch2));
//     if (ch2_target_val > rc_map.rc2_max) {
//         ch2_target_val = rc_map.rc2_max;
//     } else if (ch2_target_val < rc_map.rc2_min) {
//         ch2_target_val = rc_map.rc2_min;
//     } else {
//     }
//
//     ch3_target_val = SBUS2RC(min_max_scaler(joystick.ch3));
//     if (ch3_target_val > rc_map.rc3_max) {
//         ch3_target_val = rc_map.rc3_max;
//     } else if (ch3_target_val < rc_map.rc3_min) {
//         ch3_target_val = rc_map.rc3_min;
//     } else {
//     }
//
//     ch4_target_val = SBUS2RC(min_max_scaler(joystick.ch4));
//     if (ch4_target_val > rc_map.rc4_max) {
//         ch4_target_val = rc_map.rc4_max;
//     } else if (ch4_target_val < rc_map.rc4_min) {
//         ch4_target_val = rc_map.rc4_min;
//     } else {
//     }
//
//     ch5_target_val = SBUS2RC(min_max_scaler(joystick.ch5));
//     if (ch5_target_val > rc_map.rc5_max) {
//         ch5_target_val = rc_map.rc5_max;
//     } else if (ch5_target_val < rc_map.rc5_min) {
//         ch5_target_val = rc_map.rc5_min;
//     } else {
//     }
//
//     ch6_target_val = SBUS2RC(min_max_scaler(joystick.ch6));
//     if (ch6_target_val > rc_map.rc6_max) {
//         ch6_target_val = rc_map.rc6_max;
//     } else if (ch6_target_val < rc_map.rc6_min) {
//         ch6_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch7_target_val = SBUS2RC(min_max_scaler(joystick.ch7));
//     if (ch7_target_val > rc_map.rc6_max) {
//         ch7_target_val = rc_map.rc6_max;
//     } else if (ch7_target_val < rc_map.rc6_min) {
//         ch7_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch8_target_val = SBUS2RC(min_max_scaler(joystick.ch8));
//     if (ch8_target_val > rc_map.rc6_max) {
//         ch8_target_val = rc_map.rc6_max;
//     } else if (ch8_target_val < rc_map.rc6_min) {
//         ch8_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch9_target_val = SBUS2RC(min_max_scaler(joystick.ch9));
//     if (ch9_target_val > rc_map.rc6_max) {
//         ch9_target_val = rc_map.rc6_max;
//     } else if (ch9_target_val < rc_map.rc6_min) {
//         ch9_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch10_target_val = SBUS2RC(min_max_scaler(joystick.ch10));
//     if (ch10_target_val > rc_map.rc6_max) {
//         ch10_target_val = rc_map.rc6_max;
//     } else if (ch10_target_val < rc_map.rc6_min) {
//         ch10_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch11_target_val = SBUS2RC(min_max_scaler(joystick.ch11));
//     if (ch11_target_val > rc_map.rc6_max) {
//         ch11_target_val = rc_map.rc6_max;
//     } else if (ch11_target_val < rc_map.rc6_min) {
//         ch11_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch12_target_val = SBUS2RC(min_max_scaler(joystick.ch12));
//     if (ch12_target_val > rc_map.rc6_max) {
//         ch12_target_val = rc_map.rc6_max;
//     } else if (ch12_target_val < rc_map.rc6_min) {
//         ch12_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch13_target_val = SBUS2RC(min_max_scaler(joystick.ch13));
//     if (ch13_target_val > rc_map.rc6_max) {
//         ch13_target_val = rc_map.rc6_max;
//     } else if (ch13_target_val < rc_map.rc6_min) {
//         ch13_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch14_target_val = SBUS2RC(min_max_scaler(joystick.ch14));
//     if (ch14_target_val > rc_map.rc6_max) {
//         ch14_target_val = rc_map.rc6_max;
//     } else if (ch14_target_val < rc_map.rc6_min) {
//         ch14_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch15_target_val = SBUS2RC(min_max_scaler(joystick.ch15));
//     if (ch15_target_val > rc_map.rc6_max) {
//         ch15_target_val = rc_map.rc6_max;
//     } else if (ch15_target_val < rc_map.rc6_min) {
//         ch15_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch16_target_val = SBUS2RC(min_max_scaler(joystick.ch16));
//     if (ch16_target_val > rc_map.rc6_max) {
//         ch16_target_val = rc_map.rc6_max;
//     } else if (ch16_target_val < rc_map.rc6_min) {
//         ch16_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch17_target_val = SBUS2RC(min_max_scaler(joystick.ch17));
//     if (ch17_target_val > rc_map.rc6_max) {
//         ch17_target_val = rc_map.rc6_max;
//     } else if (ch17_target_val < rc_map.rc6_min) {
//         ch17_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch18_target_val = SBUS2RC(min_max_scaler(joystick.ch18));
//     if (ch18_target_val > rc_map.rc6_max) {
//         ch18_target_val = rc_map.rc6_max;
//     } else if (ch18_target_val < rc_map.rc6_min) {
//         ch18_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch19_target_val = SBUS2RC(min_max_scaler(joystick.ch19));
//     if (ch19_target_val > rc_map.rc6_max) {
//         ch19_target_val = rc_map.rc6_max;
//     } else if (ch19_target_val < rc_map.rc6_min) {
//         ch19_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch20_target_val = SBUS2RC(min_max_scaler(joystick.ch20));
//     if (ch20_target_val > rc_map.rc6_max) {
//         ch20_target_val = rc_map.rc6_max;
//     } else if (ch20_target_val < rc_map.rc6_min) {
//         ch20_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch21_target_val = SBUS2RC(min_max_scaler(joystick.ch21));
//     if (ch21_target_val > rc_map.rc6_max) {
//         ch21_target_val = rc_map.rc6_max;
//     } else if (ch21_target_val < rc_map.rc6_min) {
//         ch21_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch22_target_val = SBUS2RC(min_max_scaler(joystick.ch22));
//     if (ch22_target_val > rc_map.rc6_max) {
//         ch22_target_val = rc_map.rc6_max;
//     } else if (ch22_target_val < rc_map.rc6_min) {
//         ch22_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch23_target_val = SBUS2RC(min_max_scaler(joystick.ch23));
//     if (ch23_target_val > rc_map.rc6_max) {
//         ch23_target_val = rc_map.rc6_max;
//     } else if (ch23_target_val < rc_map.rc6_min) {
//         ch23_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch24_target_val = SBUS2RC(min_max_scaler(joystick.ch24));
//     if (ch24_target_val > rc_map.rc6_max) {
//         ch24_target_val = rc_map.rc6_max;
//     } else if (ch24_target_val < rc_map.rc6_min) {
//         ch24_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch25_target_val = SBUS2RC(min_max_scaler(joystick.ch25));
//     if (ch25_target_val > rc_map.rc6_max) {
//         ch25_target_val = rc_map.rc6_max;
//     } else if (ch25_target_val < rc_map.rc6_min) {
//         ch25_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch26_target_val = SBUS2RC(min_max_scaler(joystick.ch26));
//     if (ch26_target_val > rc_map.rc6_max) {
//         ch26_target_val = rc_map.rc6_max;
//     } else if (ch26_target_val < rc_map.rc6_min) {
//         ch26_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch27_target_val = SBUS2RC(min_max_scaler(joystick.ch27));
//     if (ch27_target_val > rc_map.rc6_max) {
//         ch27_target_val = rc_map.rc6_max;
//     } else if (ch27_target_val < rc_map.rc6_min) {
//         ch27_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch28_target_val = SBUS2RC(min_max_scaler(joystick.ch28));
//     if (ch28_target_val > rc_map.rc6_max) {
//         ch28_target_val = rc_map.rc6_max;
//     } else if (ch28_target_val < rc_map.rc6_min) {
//         ch28_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch29_target_val = SBUS2RC(min_max_scaler(joystick.ch29));
//     if (ch29_target_val > rc_map.rc6_max) {
//         ch29_target_val = rc_map.rc6_max;
//     } else if (ch29_target_val < rc_map.rc6_min) {
//         ch29_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch30_target_val = SBUS2RC(min_max_scaler(joystick.ch30));
//     if (ch30_target_val > rc_map.rc6_max) {
//         ch30_target_val = rc_map.rc6_max;
//     } else if (ch30_target_val < rc_map.rc6_min) {
//         ch30_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch31_target_val = SBUS2RC(min_max_scaler(joystick.ch31));
//     if (ch31_target_val > rc_map.rc6_max) {
//         ch31_target_val = rc_map.rc6_max;
//     } else if (ch31_target_val < rc_map.rc6_min) {
//         ch31_target_val = rc_map.rc6_min;
//     } else {
//     }
//
//     ch32_target_val = SBUS2RC(min_max_scaler(joystick.ch32));
//     if (ch32_target_val > rc_map.rc6_max) {
//         ch32_target_val = rc_map.rc6_max;
//     } else if (ch32_target_val < rc_map.rc6_min) {
//         ch32_target_val = rc_map.rc6_min;
//     } else {
//     }
// }

// setInterval(channel_val, TIMEOUT);

global.rxbuf = '';

global.ch1 = parseInt(ch_mid_val);
global.ch2 = parseInt(ch_mid_val);
global.ch3 = parseInt(ch_mid_val);
global.ch4 = parseInt(ch_mid_val);
global.ch5 = parseInt(ch_max_val);
global.ch6 = parseInt(ch_min_val);
global.ch7 = parseInt(ch_min_val);
global.ch8 = parseInt(ch_min_val);
global.ch9 = parseInt(ch_min_val);
global.ch10 = parseInt(ch_min_val);
global.ch11 = parseInt(ch_min_val);
global.ch12 = parseInt(ch_min_val);
global.ch13 = parseInt(ch_min_val);
global.ch14 = parseInt(ch_min_val);
global.ch15 = parseInt(ch_min_val);
global.ch16 = parseInt(ch_min_val);
global.ch17 = parseInt(ch_min_val);
global.ch18 = parseInt(ch_min_val);
global.ch19 = parseInt(ch_min_val);
global.ch20 = parseInt(ch_min_val);
global.ch21 = parseInt(ch_min_val);
global.ch22 = parseInt(ch_min_val);
global.ch23 = parseInt(ch_min_val);
global.ch24 = parseInt(ch_min_val);
global.ch25 = parseInt(ch_min_val);
global.ch26 = parseInt(ch_min_val);
global.ch27 = parseInt(ch_min_val);
global.ch28 = parseInt(ch_min_val);
global.ch29 = parseInt(ch_min_val);
global.ch30 = parseInt(ch_min_val);
global.ch31 = parseInt(ch_min_val);
global.ch32 = parseInt(ch_min_val);

global.ch1_target_val = parseInt(ch_mid_val);
global.ch2_target_val = parseInt(ch_mid_val);
global.ch3_target_val = parseInt(ch_mid_val);
global.ch4_target_val = parseInt(ch_mid_val);
global.ch5_target_val = parseInt(ch_max_val);
global.ch6_target_val = parseInt(ch_min_val);
global.ch7_target_val = parseInt(ch_min_val);
global.ch8_target_val = parseInt(ch_min_val);
global.ch9_target_val = parseInt(ch_min_val);
global.ch10_target_val = parseInt(ch_min_val);
global.ch11_target_val = parseInt(ch_min_val);
global.ch12_target_val = parseInt(ch_min_val);
global.ch13_target_val = parseInt(ch_min_val);
global.ch14_target_val = parseInt(ch_min_val);
global.ch15_target_val = parseInt(ch_min_val);
global.ch16_target_val = parseInt(ch_min_val);
global.ch17_target_val = parseInt(ch_min_val);
global.ch18_target_val = parseInt(ch_min_val);
global.ch19_target_val = parseInt(ch_min_val);
global.ch20_target_val = parseInt(ch_min_val);
global.ch21_target_val = parseInt(ch_min_val);
global.ch22_target_val = parseInt(ch_min_val);
global.ch23_target_val = parseInt(ch_min_val);
global.ch24_target_val = parseInt(ch_min_val);
global.ch25_target_val = parseInt(ch_min_val);
global.ch26_target_val = parseInt(ch_min_val);
global.ch27_target_val = parseInt(ch_min_val);
global.ch28_target_val = parseInt(ch_min_val);
global.ch29_target_val = parseInt(ch_min_val);
global.ch30_target_val = parseInt(ch_min_val);
global.ch31_target_val = parseInt(ch_min_val);
global.ch32_target_val = parseInt(ch_min_val);

function channel_val(obj_lib_data) {
    // rxbuf = '';
    // rxbuf += 'ff';
    //
    // // CH1 - Roll
    // ch1 = ch1_target_val;
    // ch1 = RC2SBUS(ch1);
    // let hex_ch1 = ch1.toString(16);
    // rxbuf += hex_ch1;
    //
    // // CH2 - Pitch
    // ch2 = ch2_target_val;
    // ch2 = RC2SBUS(ch2);
    // let hex_ch2 = ch2.toString(16);
    // rxbuf += hex_ch2;
    //
    // // CH3 - Throttle
    // ch3 = ch3_target_val;
    // ch3 = RC2SBUS(ch3);
    // let hex_ch3 = ch3.toString(16);
    // rxbuf += hex_ch3;
    //
    // // CH4 - Yaw
    // ch4 = ch4_target_val;
    // ch4 = RC2SBUS(ch4);
    // let hex_ch4 = ch4.toString(16);
    // rxbuf += hex_ch4;
    //
    // // Switch 1
    // ch5 = ch5_target_val;
    // ch5 = RC2SBUS(ch5);
    // let hex_ch5 = ch5.toString(16);
    // rxbuf += hex_ch5;
    //
    // // Switch 2
    // ch6 = ch6_target_val;
    // ch6 = RC2SBUS(ch6);
    // // ch6 = 225;
    // let hex_ch6 = ch6.toString(16);
    // rxbuf += hex_ch6;
    //
    // // Switch 3
    // ch7 = ch7_target_val;
    // ch7 = RC2SBUS(ch7);
    // let hex_ch7 = ch7.toString(16);
    // rxbuf += hex_ch7;
    //
    // // Switch 4
    // ch8 = ch8_target_val;
    // ch8 = RC2SBUS(ch8);
    // let hex_ch8 = ch8.toString(16);
    // rxbuf += hex_ch8;
    //
    // // Switch 5
    // ch9 = ch9_target_val;
    // ch9 = RC2SBUS(ch9);
    // let hex_ch9 = ch9.toString(16);
    // rxbuf += hex_ch9;
    //
    // // Switch 6
    // ch10 = ch10_target_val;
    // ch10 = RC2SBUS(ch10);
    // let hex_ch10 = ch10.toString(16);
    // rxbuf += hex_ch10;
    //
    // // Switch 7
    // ch11 = ch11_target_val;
    // ch11 = RC2SBUS(ch11);
    // let hex_ch11 = ch11.toString(16);
    // rxbuf += hex_ch11;
    //
    // // Switch 8
    // ch12 = ch12_target_val;
    // ch12 = RC2SBUS(ch12);
    // let hex_ch12 = ch12.toString(16);
    // rxbuf += hex_ch12;
    //
    // // Switch 9
    // ch13 = ch13_target_val;
    // ch13 = RC2SBUS(ch13);
    // let hex_ch13 = ch13.toString(16);
    // rxbuf += hex_ch13;
    //
    // // Switch 10
    // ch14 = ch14_target_val;
    // ch14 = RC2SBUS(ch14);
    // let hex_ch14 = ch14.toString(16);
    // rxbuf += hex_ch14;
    //
    // // Switch 11
    // ch15 = ch15_target_val;
    // ch15 = RC2SBUS(ch15);
    // let hex_ch15 = ch15.toString(16);
    // rxbuf += hex_ch15;
    //
    // // Switch 12
    // ch16 = ch16_target_val;
    // ch16 = RC2SBUS(ch16);
    // let hex_ch16 = ch16.toString(16);
    // rxbuf += hex_ch16;
    //
    // // Switch 13
    // ch17 = ch17_target_val;
    // ch17 = RC2SBUS(ch17);
    // let hex_ch17 = ch17.toString(16);
    // rxbuf += hex_ch17;
    //
    // ch18 = ch18_target_val;
    // ch18 = RC2SBUS(ch18);
    // let hex_ch18 = ch18.toString(16);
    // rxbuf += hex_ch18;
    //
    // ch19 = ch19_target_val;
    // ch19 = RC2SBUS(ch19);
    // let hex_ch19 = ch19.toString(16);
    // rxbuf += hex_ch19;
    //
    // ch20 = ch20_target_val;
    // ch20 = RC2SBUS(ch20);
    // let hex_ch20 = ch20.toString(16);
    // rxbuf += hex_ch20;
    //
    // ch21 = ch21_target_val;
    // ch21 = RC2SBUS(ch21);
    // let hex_ch21 = ch21.toString(16);
    // rxbuf += hex_ch21;
    //
    // ch22 = ch22_target_val;
    // ch22 = RC2SBUS(ch22);
    // let hex_ch22 = ch22.toString(16);
    // rxbuf += hex_ch22;
    //
    // ch23 = ch23_target_val;
    // ch23 = RC2SBUS(ch23);
    // let hex_ch23 = ch23.toString(16);
    // rxbuf += hex_ch23;
    //
    // ch24 = ch24_target_val;
    // ch24 = RC2SBUS(ch24);
    // let hex_ch24 = ch24.toString(16);
    // rxbuf += hex_ch24;
    //
    // ch25 = ch25_target_val;
    // ch25 = RC2SBUS(ch25);
    // let hex_ch25 = ch25.toString(16);
    // rxbuf += hex_ch25;
    //
    // ch26 = ch26_target_val;
    // ch26 = RC2SBUS(ch26);
    // let hex_ch26 = ch26.toString(16);
    // rxbuf += hex_ch26;
    //
    // ch27 = ch27_target_val;
    // ch27 = RC2SBUS(ch27);
    // let hex_ch27 = ch27.toString(16);
    // rxbuf += hex_ch27;
    //
    // ch28 = ch28_target_val;
    // ch28 = RC2SBUS(ch28);
    // let hex_ch28 = ch28.toString(16);
    // rxbuf += hex_ch28;
    //
    // ch29 = ch29_target_val;
    // ch29 = RC2SBUS(ch29);
    // let hex_ch29 = ch29.toString(16);
    // rxbuf += hex_ch29;
    //
    // ch30 = ch30_target_val;
    // ch30 = RC2SBUS(ch30);
    // let hex_ch30 = ch30.toString(16);
    // rxbuf += hex_ch30;
    //
    // ch31 = ch31_target_val;
    // ch31 = RC2SBUS(ch31);
    // let hex_ch31 = ch31.toString(16);
    // rxbuf += hex_ch31;
    //
    // ch32 = ch32_target_val;
    // ch32 = RC2SBUS(ch32);
    // let hex_ch32 = ch32.toString(16);
    // rxbuf += hex_ch32;
    //
    // crc = Calc_CRC_8(rxbuf, 33);
    // let hex_crc = crc.toString(16);
    // rxbuf += hex_crc;
    // // console.log(rxbuf);

    sbusPort.write(obj_lib_data);
    // sbusData();
}

let crc8_Table = [
    0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65,  // 0 ~ 15
    157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220,  // 16 ~ 31
    35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98,  // 32 ~ 47
    190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255,		// 48 ~ 63
    70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7,  // 64 ~ 79
    219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154,  // 80 ~ 95
    101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36,   // 96 ~ 111
    248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185,  // 112 ~ 127
    140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205,  // 128 ~ 143
    17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80,  // 144 ~ 159
    175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238,  // 160 ~ 175
    50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115,  // 176 ~ 191
    202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, // 192 ~ 207
    87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22,  // 208 ~ 223
    233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168,  // 224 ~ 239
    116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53  // 240 ~ 255
];

function Calc_CRC_8(DataArray, Length) {
    let i;
    let crc;

    crc = 0x01;
    DataArray = Buffer.from(DataArray, 'hex');
    for (i = 1; i < Length; i++) {
        crc = crc8_Table[crc ^ DataArray[i]];
    }
    return crc;
}

function sbusData() {
    let sbus = {};
    sbus.ch1 = ch1;
    sbus.ch2 = ch2;
    sbus.ch3 = ch3;
    sbus.ch4 = ch4;
    sbus.ch5 = ch5;
    sbus.ch6 = ch6;
    sbus.ch7 = ch7;
    sbus.ch8 = ch8;
    sbus.ch9 = ch9;
    sbus.ch10 = ch10;
    sbus.ch11 = ch11;
    sbus.ch12 = ch12;
    sbus.ch13 = ch13;
    sbus.ch14 = ch14;
    sbus.ch15 = ch15;
    sbus.ch16 = ch16;
    sbus.ch17 = ch17;
    sbus.ch18 = ch18;
    sbus.ch19 = ch19;
    sbus.ch20 = ch20;
    sbus.ch21 = ch21;
    sbus.ch22 = ch22;
    sbus.ch23 = ch23;
    sbus.ch24 = ch24;
    sbus.ch25 = ch25;
    sbus.ch26 = ch26;
    sbus.ch27 = ch27;
    sbus.ch28 = ch28;
    sbus.ch29 = ch29;
    sbus.ch30 = ch30;
    sbus.ch31 = ch31;
    sbus.ch32 = ch32;
    lib_mqtt_client.publish(data_topic, JSON.stringify(sbus));
}

sbusPortOpening();

function sbusPortOpening() {
    if (sbusPort == null) {
        sbusPort = new SerialPort(sbusPortNum, {
            baudRate: parseInt(sbusBaudrate, 10),
        });

        sbusPort.on('open', sbusPortOpen);
        sbusPort.on('close', sbusPortClose);
        sbusPort.on('error', sbusPortError);
        sbusPort.on('data', sbusPortData);
    } else {
        if (sbusPort.isOpen) {

        } else {
            sbusPort.open();
        }
    }
}

function sbusPortOpen() {
    console.log('sbusPort open. ' + sbusPortNum + ' Data rate: ' + sbusBaudrate);
}

function sbusPortClose() {
    console.log('sbusPort closed.');

    setTimeout(sbusPortOpening, 2000);
}

function sbusPortError(error) {
    let error_str = error.toString();
    console.log('[sbusPort error]: ' + error.message);
    if (error_str.substring(0, 14) === "Error: Opening") {

    } else {
        console.log('sbusPort error : ' + error);
    }

    setTimeout(sbusPortOpening, 2000);
}

function sbusPortData(data) {
    //console.log(data.toString());
}


let lib;

try {
    lib = JSON.parse(fs.readFileSync('./' + config.directory_name + '/lib_lte_rc.json', 'utf8'));
} catch (e) {
    lib = {
        name: 'lib_lte_rc',
        target: 'armv6',
        description: "node [name] [portnum] [baudrate]",
        scripts: 'node lib_lte_rc /dev/ttyUSB3 115200',
        data: ['SBUS'],
        control: ['REMOTE', 'STATUS']
    };
}

let lib_mqtt_client = null;
let obj_lib_data = {};

lib_mqtt_connect('localhost', 1883);

let control_topic = '/MUV/control/' + lib.name + '/' + lib.control[0]
let data_topic = '/MUV/data/' + lib.name + '/' + lib.data[0]

function lib_mqtt_connect(broker_ip, port) {
    if (lib_mqtt_client == null) {
        var connectOptions = {
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

        lib_mqtt_client = mqtt.connect(connectOptions);
    }

    lib_mqtt_client.on('connect', function () {
        console.log('[lib_mqtt_connect] connected to ' + broker_ip);
        lib_mqtt_client.subscribe(control_topic);
        console.log('[lib_mqtt_connect] control_topic: ' + control_topic);
    });

    lib_mqtt_client.on('message', function (topic, message) {
        if (topic === control_topic) {
            obj_lib_data = message;
            // let ch_num = parseInt(obj_lib_data.num);
            // let ch_val = parseFloat(obj_lib_data.value);
            // key_to_signal(ch_num, ch_val);
            // console.log(message);
            channel_val(message);
            // key_to_signal(obj_lib_data);
        }
    });

    lib_mqtt_client.on('error', function (err) {
        console.log(err.message);
    });
}
