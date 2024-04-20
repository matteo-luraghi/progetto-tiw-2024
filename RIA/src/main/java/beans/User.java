package beans;

public class User {
	private final int id;
	private final String username;
	private final String email;
	private final String name;
	private final String surname;
	
	public User(int id, String username, String email, String name, String surname) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.name = name;
		this.surname = surname;
	}
	
	public int getId() {
		return this.id;
	}
	
	public String getUsername() {
		return this.username;
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
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (this.getClass() != o.getClass()) return false;
		if (!this.getEmail().equals( ((User) o).getEmail())) return false;
		if (this.getId() != ((User) o).getId()) return false;
		if (!this.getName().equals(((User) o).getName())) return false;
		if (!this.getSurname().equals(((User) o).getSurname())) return false;
		if (!this.getUsername().equals(((User) o).getUsername())) return false;
		return true;
	}
}