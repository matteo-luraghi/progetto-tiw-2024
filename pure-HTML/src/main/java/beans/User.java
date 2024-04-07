package beans;

public class User {
	private final int id;
	private final String email;
	private final String name;
	private final String surname;
	
	public User(int id, String email, String name, String surname) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.surname = surname;
	}
	
	public int getId() {
		return this.id;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getSurname() {
		return this.surname;
	}
}
