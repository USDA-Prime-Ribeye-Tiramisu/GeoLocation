package com.dallas.rent.geolocation.controller;

import com.dallas.rent.geolocation.service.DallasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    @GetMapping("hello")
    public String test() {
        return "Hello World";
    }

    @GetMapping()
    public Page<Dallas> getDallasPage(Pageable pageable) {
        System.out.println(pageable);
        return service.findAll(pageable);
    }

    @GetMapping("all")
    public List<Dallas> getAll() {
        return service.all();
    }  

    @CrossOrigin
    @GetMapping("{lat}/{lon}/{distanceM}")
	public List<Dallas> getHouseNear(
			@PathVariable double lat, 
			@PathVariable double lon, 
			@PathVariable double distanceM){
		return service.findAround(lat, lon, distanceM);
	}

    @CrossOrigin
    @GetMapping("average/{lat}/{lon}/{distanceM}")
	public Integer getAverage(
			@PathVariable String lat, 
			@PathVariable String lon, 
			@PathVariable String distanceM){
		return service.findAverage(Double.parseDouble(lat), Double.parseDouble(lon), Double.parseDouble(distanceM));
	}
    
    // @GetMapping("/test")
    // public List<Dallas> getHouseNear(
    // ) {
    //     return service.findWithin();
    // }
}
