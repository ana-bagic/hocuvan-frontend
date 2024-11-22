package hr.fer.proinz.projekt.hocuvan.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

/**
 * The Class ReviewPost represents a ternary relationship between Visitor, Event
 * and Review. The rules are simple: user leaves one review after one event,
 * event gets many reviews and every review is from different person a.k.a. one
 * person can not leave multiple reviews on one event and one review is left by
 * one visitor after one event.
 * 
 * @author Nina
 */

/*
cekamo da nam demos posalje kako raditi ternarne veze pa cemo nadograditi klasu
 */

@Entity
public class ReviewPost {

	/**
	 * The Class Pk represents a composite primary key of this ternary relationship.
	 * It is consisted of visitor id and event id.
	 */
	@Embeddable
	public static class Pk implements Serializable {

		/** The visitor id. */
		@Column(nullable = false, updatable = false)
		private Long visId;

		/** The event id. */
		@Column(nullable = false, updatable = false)
		private Long eventId;

		/**
		 * Instantiates a new primary key.
		 */
		public Pk() {
		}

		/**
		 * Instantiates a new primary key.
		 *
		 * @param visId   the visitor id
		 * @param eventId the event id
		 */
		public Pk(Long visId, Long eventId) {
			this.visId = visId;
			this.eventId = eventId;
		}

		/**
		 * Gets the visitor id.
		 *
		 * @return the visitor id
		 */
		public Long getVisId() {
			return visId;
		}

		/**
		 * Sets the visitor id.
		 *
		 * @param visId the new visitor id
		 */
		public void setVisId(Long visId) {
			this.visId = visId;
		}

		/**
		 * Gets the event id.
		 *
		 * @return the event id
		 */
		public Long getEventId() {
			return eventId;
		}

		/**
		 * Sets the event id.
		 *
		 * @param eventId the new event id
		 */
		public void setEventId(Long eventId) {
			this.eventId = eventId;
		}

		/**
		 * Equals.
		 *
		 * @param o the o
		 * @return true, if successful
		 */
		@Override
		public boolean equals(Object o) {
			if (this == o)
				return true;
			if (o == null || getClass() != o.getClass())
				return false;
			Pk pk = (Pk) o;
			return Objects.equals(visId, pk.visId) && Objects.equals(eventId, pk.eventId);
		}

		/**
		 * Hash code.
		 *
		 * @return the int
		 */
		@Override
		public int hashCode() {
			return Objects.hash(visId, eventId);
		}
	}

	/** The primary key. */
	@EmbeddedId
	private Pk pk;

	/** The visitor id. */
	@ManyToOne
	@JoinColumn(name = "visId", insertable = false, updatable = false)
	private Visitor visId;

	/** The event id. */
	@ManyToOne
	@JoinColumn(name = "eventId", insertable = false, updatable = false)
	private Event eventId;

	/** The review id. */
	@OneToOne
	@JoinColumn(name = "reviewId", insertable = false, updatable = false)
	private Review reviewId;

	/**
	 * Gets the primary key.
	 *
	 * @return the primary key
	 */
	public Pk getPk() {
		return pk;
	}

	/**
	 * Sets the primary key.
	 *
	 * @param pk the new primary key
	 */
	public void setPk(Pk pk) {
		this.pk = pk;
	}

	/**
	 * Gets the visitor id.
	 *
	 * @return the visitor id
	 */
	public Visitor getVisId() {
		return visId;
	}

	/**
	 * Sets the visitor id.
	 *
	 * @param visId the new visitor id
	 */
	public void setVisId(Visitor visId) {
		this.visId = visId;
	}

	/**
	 * Gets the event id.
	 *
	 * @return the event id
	 */
	public Event getEventId() {
		return eventId;
	}

	/**
	 * Sets the event id.
	 *
	 * @param eventId the new event id
	 */
	public void setEventId(Event eventId) {
		this.eventId = eventId;
	}

	/**
	 * Gets the review id.
	 *
	 * @return the review id
	 */
	public Review getReviewId() {
		return reviewId;
	}

	/**
	 * Sets the review id.
	 *
	 * @param reviewId the new review id
	 */
	public void setReviewId(Review reviewId) {
		this.reviewId = reviewId;
	}

	/**
	 * Instantiates a new review post.
	 */
	public ReviewPost() {
	}

	/**
	 * Instantiates a new review post.
	 *
	 * @param pk       the pk
	 * @param visId    the vis id
	 * @param eventId  the event id
	 * @param reviewId the review id
	 */
	public ReviewPost(Pk pk, Visitor visId, Event eventId, Review reviewId) {
		this.pk = pk;
		this.visId = visId;
		this.eventId = eventId;
		this.reviewId = reviewId;
	}
}
