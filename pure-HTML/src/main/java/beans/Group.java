package beans;
import java.sql.Date;

public class Group {
	private final int id;
	private final String title;
	private final Date creation_date;
	private final int duration;
	private final int min_participants;
	private final int max_participants;
	
	public Group(int id, String title, Date creation_date, int duration, int min_participants, int max_participants) {
		this.id = id;
		this.title = title;
		this.creation_date = creation_date;
		this.duration = duration;
		this.min_participants = min_participants;
		this.max_participants = max_participants;
	}
	
	public int getId() {
		return this.id;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public Date getDate() {
		return this.creation_date;
	}
	
	public int getDuration() {
		return this.duration;
	}
	
	public int getMinParticipants() {
		return this.min_participants;
	}
	
	public int getMaxParticipants() {
		return this.max_participants;
	}
}
