package com.dallas.rent.geolocation.service;

import java.io.Console;
import java.util.List;

import com.dallas.rent.geolocation.model.Dallas;
import com.dallas.rent.geolocation.repository.DallasRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DallasService {

    @Autowired
    private DallasRepository repository;

    public List<Dallas> findAround(double lat, double lon, double distanceM) {
        return repository.findNearWithinDistance(lat, lon, distanceM);
    }

    public List<Dallas> findThreeNearest(double lat, double lon) {
        double distance = 800;
        double max = 3;
        return repository.findThreeNearest(lat, lon , distance, max);
    }
}
