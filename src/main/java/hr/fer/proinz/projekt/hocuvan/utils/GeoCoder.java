package hr.fer.proinz.projekt.hocuvan.utils;

import com.byteowls.jopencage.JOpenCageGeocoder;
import com.byteowls.jopencage.model.JOpenCageForwardRequest;
import com.byteowls.jopencage.model.JOpenCageLatLng;
import com.byteowls.jopencage.model.JOpenCageResponse;
import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.helpers.EventLocationDTA;
import hr.fer.proinz.projekt.hocuvan.helpers.EventLongLat;

public class GeoCoder {

    static JOpenCageGeocoder jOpenCageGeocoder = new JOpenCageGeocoder("14c3faca1114449cb733f3b15240815c");

    public static EventLocationDTA codeAddressToLatAndLng(Event event) {
        JOpenCageForwardRequest request = new JOpenCageForwardRequest(event.getLocation());
        request.setMinConfidence(1);
        request.setNoAnnotations(false);
        request.setNoDedupe(true);
        JOpenCageResponse response = jOpenCageGeocoder.forward(request);
        JOpenCageLatLng firstResultLatLng = response.getFirstPosition(); // get the coordinate pair of the first result
        return new EventLocationDTA(firstResultLatLng.getLat(),firstResultLatLng.getLng(),event);
    }

    public static EventLongLat getEventLongLat(Event event){
        JOpenCageForwardRequest request = new JOpenCageForwardRequest(event.getLocation());
        request.setMinConfidence(1);
        request.setNoAnnotations(false);
        request.setNoDedupe(true);
        JOpenCageResponse response = jOpenCageGeocoder.forward(request);
        JOpenCageLatLng firstResultLatLng = response.getFirstPosition(); // get the coordinate pair of the first result
        return new EventLongLat(event.getEventId(),firstResultLatLng.getLat(),firstResultLatLng.getLng());

    }

}
