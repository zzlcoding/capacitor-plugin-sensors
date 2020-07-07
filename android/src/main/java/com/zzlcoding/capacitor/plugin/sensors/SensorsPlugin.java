package com.zzlcoding.capacitor.plugin.sensors;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NativePlugin(name = "_SensorsPlugin")
public class SensorsPlugin extends Plugin  implements SensorEventListener {


    private SensorManager sensorManager;

    private Map<String, PluginCall> startedSensorMap = new HashMap<>();

    public SensorsPlugin() {
        super();
    }

    @PluginMethod()
    public void get(PluginCall call) {
        synchronized (this) {
            if (sensorManager == null) {
                sensorManager = (SensorManager)this.getActivity().getSystemService(Context.SENSOR_SERVICE);
            }
        }

        String type = call.getString("type");
        SensorType sensorType = SensorType.valueOf(type);
        List<Sensor> sensors = sensorManager.getSensorList(sensorType.getValue());

        JSArray sensorArray = new JSArray();
        for (Sensor sensor: sensors) {
            String id = getSensorId(sensor);
            String name = getSensorName(sensor);
            SensorType st = getSensorType(sensor);
            JSObject sensorObj = new JSObject();
            sensorObj.put("id", id);
            sensorObj.put("name", name);
            sensorObj.put("type", st.toString());
            sensorArray.put(sensorObj);
        }

        JSObject result = new JSObject();
        result.put("sensors", sensorArray);

        call.success(result);
    }

    @PluginMethod()
    public void start(PluginCall call) {
        String id = call.getString("id");
        String name = call.getString("name");
        String type = call.getString("type");

        if (startedSensorMap.containsKey(id)) {
            call.error(String.format("sensor is already started: %s", id));
            return;
        }

        SensorType sensorType = SensorType.valueOf(type);
        Sensor sensor = getSensor(sensorType, name);
        if (sensor == null) {
            call.error(String.format("can not find sensor with name (%s) for type (%s)", name, type));
            return;
        }

        call.save();
        sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL);
        startedSensorMap.put(id, call);
    }

    @PluginMethod()
    public void stop(PluginCall call) {
        String id = call.getString("id");
        String name = call.getString("name");
        String type = call.getString("type");

        if (!startedSensorMap.containsKey(id)) {
            call.error(String.format("sensor is not started: %s", id));
            return;
        }

        PluginCall startCall = startedSensorMap.get(id);
        startCall.release(this.getBridge());
        startedSensorMap.remove(id);

        SensorType sensorType = SensorType.valueOf(type);
        Sensor sensor = getSensor(sensorType, name);
        if (sensor == null) {
            call.error(String.format("can not find sensor with name (%s) for type (%s)", name, type));
            return;
        }

        sensorManager.unregisterListener(this, sensor);
        call.success();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        String sensorId = getSensorId(event.sensor);
        if (startedSensorMap.containsKey(sensorId)) {
            PluginCall call = startedSensorMap.get(sensorId);
            JSArray values = new JSArray();
            for (float value : event.values) {
                try {
                    values.put((double)value);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            JSObject object = new JSObject();
            object.put("values", values);
            call.resolve(object);
            call.save();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    private String getSensorId(Sensor sensor) {
        return sensor.toString();
    }

    private String getSensorName(Sensor sensor) {
        return sensor.getName();
    }

    private SensorType getSensorType(Sensor sensor) {
        int type = sensor.getType();
        SensorType[] values = SensorType.values();
        for (SensorType st : values) {
            if (st.getValue() == type) {
                return st;
            }
        }
        return SensorType.UNKNOWN;
    }

    private Sensor getSensor(SensorType type, String name) {
        List<Sensor> sensors = sensorManager.getSensorList(type.getValue());
        for (Sensor sensor : sensors) {
            if (sensor.getName().equals(name)) {
                return sensor;
            }
        }
        return null;
    }
}
