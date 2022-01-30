package com.dallas.rent.geolocation.service;

import java.util.List;

import com.dallas.rent.geolocation.model.Dallas;
import com.dallas.rent.geolocation.repository.DallasRepository;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.PrecisionModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DallasService {

    @Autowired
    private DallasRepository repository;

    private GeometryFactory factory = new GeometryFactory(new PrecisionModel(), 4326);

    public Page<Dallas> findAll(Pageable page) {
        return repository.findAll(page);
    }

    public List<Dallas> all() {
        return repository.findAll();
    }

    // public List<Dallas> findWithin() {
        // log.info("Looking for city around ({},{}) withing {} meters", lat, lon, distanceM);
        // Point p = factory.createPoint(new Coordinate(lon, lat));
        // return repository.findNearWithinDistnace();
    // }


    public Integer findAverage(double lat, double lon, double distanceM) {
        List<Dallas> houses = findAround(lat, lon, distanceM);

        int sum = 0;

        for (Dallas house: houses) {
            sum += house.getRent();
        }

        return sum/houses.size();
    }


    public List<Dallas> findAround(double lat, double lon, double distanceM){
		// log.info("Looking for city around ({},{}) withing {} meters", lat, lon, distanceM);
		// Point p = factory.createPoint(new Coordinate(lon, lat));

        Integer latitude = (int) lat;
        Integer longitude = (int) lon;
        
		return repository.findNearWithinDistnace(latitude, longitude, distanceM);
	}
}
