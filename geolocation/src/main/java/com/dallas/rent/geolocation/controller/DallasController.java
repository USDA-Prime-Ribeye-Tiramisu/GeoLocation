package com.dallas.rent.geolocation.controller;

import com.dallas.rent.geolocation.service.DallasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.dallas.rent.geolocation.model.Dallas;

@RestController
@RequestMapping("dallas")
public class DallasController {

    @Autowired
    private DallasService service;

    @CrossOrigin
    @GetMapping("{lat}/{lon}/{distanceM}")
    public List<Dallas> getHouseNear(
            @PathVariable double lat,
            @PathVariable double lon,
            @PathVariable double distanceM) {
        return service.findAround(lat, lon, distanceM);
    }

    @CrossOrigin
    @GetMapping("{lat}/{lon}")
    public List<Dallas> getThreeNearest(
        @PathVariable double lat,
        @PathVariable double lon
    ) {
        return service.findThreeNearest(lat, lon);
    }

    // @CrossOrigin
    // @PostMapping("/upload")
    // public String
}
