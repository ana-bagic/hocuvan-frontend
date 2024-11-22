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
 * The Class SendReceive represents a ternary relationship between Visitor,
 * Organizer and Message. The rules are simple: visitor sends multiple messages
 * to one organizer, organizer sends multiple messages to one visitor and one
 * message is send by one visitor to one organizer.
 * 
 * @author Nina
 */

/*
cekamo da nam demos posalje kako raditi ternarne veze pa cemo nadograditi klasu
 */

@Entity
public class SendReceive {

	/**
	 * The Class Pk represents a composite primary key of this ternary relationship.
	 * It is consisted of organizer id and message id.
	 */
	@Embeddable
	public static class Pk implements Serializable {

		/** The organizer id. */
		@Column(nullable = false, updatable = false)
		private Long orgId;

		/** The message id. */
		@Column(nullable = false, updatable = false)
		private Long messageId;

		/**
		 * Instantiates a new primary key.
		 */
		public Pk() {
		}

		/**
		 * Instantiates a new primary key.
		 *
		 * @param orgId     the organizer id
		 * @param messageId the message id
		 */
		public Pk(Long orgId, Long messageId) {
			this.orgId = orgId;
			this.messageId = messageId;
		}

		/**
		 * Gets the organizer id.
		 *
		 * @return the organizer id
		 */
		public Long getOrgId() {
			return orgId;
		}

		/**
		 * Sets the organizer id.
		 *
		 * @param orgId the new organizer id
		 */
		public void setOrgId(Long orgId) {
			this.orgId = orgId;
		}

		/**
		 * Gets the message id.
		 *
		 * @return the message id
		 */
		public Long getMessageId() {
			return messageId;
		}

		/**
		 * Sets the message id.
		 *
		 * @param messageId the new message id
		 */
		public void setMessageId(Long messageId) {
			this.messageId = messageId;
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
			return Objects.equals(orgId, pk.orgId) && Objects.equals(messageId, pk.messageId);
		}

		/**
		 * Hash code.
		 *
		 * @return the int
		 */
		@Override
		public int hashCode() {
			return Objects.hash(orgId, messageId);
		}

	}

	/** The primary key. */
	@EmbeddedId
	private Pk pk;

	/** The organizer id. */
	@OneToOne
	@JoinColumn(name = "orgId", insertable = false, updatable = false)
	private Organizer orgId;

	/** The message id. */
	@ManyToOne
	@JoinColumn(name = "messageId", insertable = false, updatable = false)
	private Message messageId;

	/** The visitor id. */
	@OneToOne
	@JoinColumn(name = "visId", insertable = false, updatable = false)
	private Visitor visId;

	/**
	 * Instantiates a new send receive.
	 */
	public SendReceive() {
	}

	/**
	 * Instantiates a new send receive.
	 *
	 * @param pk        the primary key
	 * @param orgId     the organizer id
	 * @param messageId the message id
	 * @param visId     the visitor id
	 */
	public SendReceive(Pk pk, Organizer orgId, Message messageId, Visitor visId) {
		this.pk = pk;
		this.orgId = orgId;
		this.messageId = messageId;
		this.visId = visId;
	}

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
	 * Gets the organizer id.
	 *
	 * @return the organizer id
	 */
	public Organizer getOrgId() {
		return orgId;
	}

	/**
	 * Sets the organizer id.
	 *
	 * @param orgId the new organizer id
	 */
	public void setOrgId(Organizer orgId) {
		this.orgId = orgId;
	}

	/**
	 * Gets the message id.
	 *
	 * @return the message id
	 */
	public Message getMessageId() {
		return messageId;
	}

	/**
	 * Sets the message id.
	 *
	 * @param messageId the new message id
	 */
	public void setMessageId(Message messageId) {
		this.messageId = messageId;
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

}
