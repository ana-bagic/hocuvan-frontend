package hr.fer.proinz.projekt.hocuvan;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.helpers.EventLocationDTA;
import hr.fer.proinz.projekt.hocuvan.helpers.VisitorDTO;
import hr.fer.proinz.projekt.hocuvan.service.impl.VisitorServiceJpa;
import hr.fer.proinz.projekt.hocuvan.utils.GeoCoder;

public class JUnitTests {

	@Test
	public void visitorDTOtest() {
		Visitor visitor = new Visitor(1L, "ime", "prezime", "korime", "sifra", "ime@mail.hr", "098777777");
		VisitorDTO visitorDTO = VisitorDTO.fromVisitorToVisitorDTO(visitor);
		VisitorDTO visitorDTO2 = new VisitorDTO("ime", "prezime", "korime", "ime@mail.hr", "098777777");
		assertEquals(visitorDTO2.getFirstName(), visitorDTO.getFirstName());
		assertEquals(visitorDTO2.getLastName(), visitorDTO.getLastName());
		assertEquals(visitorDTO2.getUsername(), visitorDTO.getUsername());
		assertEquals(visitorDTO2.getEmail(), visitorDTO.getEmail());
		assertEquals(visitorDTO2.getPhoneNumber(), visitorDTO.getPhoneNumber());
	}

	@Test
	public void visitorCreateTest() {
		VisitorServiceJpa jpa = new VisitorServiceJpa();
		boolean test = false;
		try {
			jpa.createVisitor(null);
		} catch (IllegalArgumentException exception) {
			test = true;
		}
		assertTrue(test);
	}

	@Test
	public void geoCoderTest() {
		Event event = new Event();
		event.setLocation("Unska ul. 3, 10000, Zagreb");
		EventLocationDTA dta = GeoCoder.codeAddressToLatAndLng(event);

		assertEquals(String.format("%.2f", (double) dta.getLatitude()), "45.80");
		assertEquals(String.format("%.2f", (double) dta.getLongitude()), "15.97");
	}

	@Test
	public void geoCoderTest2() {
		boolean test = false;
		try {
			GeoCoder.getEventLongLat(null);
		} catch (NullPointerException exception) {
			test = true;
		}
		assertTrue(test);
	}

}
