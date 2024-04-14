package dao;

import java.sql.Connection;    
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.sql.Statement;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import beans.Group;

public class GroupDAO {
	private Connection connection;
	
	public GroupDAO(Connection connection) {
		this.connection = connection;
	}
	
	public Group getGroup(int id) throws SQLException, ParseException {
		String query = "SELECT * FROM group WHERE id = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(id));
			
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					result.next();
					String group_title = result.getString("title");
					String creation_date = result.getString("creation_date");
					int group_duration = Integer.parseInt(result.getString("duration"));
					int group_min_participants = Integer.parseInt(result.getString("min_participants"));
					int group_max_participants = Integer.parseInt(result.getString("max_participants"));
					
					// parse the string to get sql Date object
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");				
					java.util.Date date = sdf.parse(creation_date);
					Date group_creation_date = new Date(date.getTime());
					
					Group group = new Group(id, group_title, group_creation_date, group_duration, group_min_participants, group_max_participants);
					return group;
				}
			}		
		}
	}
	
	public int createGroup(String title, Date creation_date, int duration, int min_participants, int max_participants) throws SQLException {
		String query = "INSERT INTO group (title, creation_date, duration, min_participants, max_participants) VALUES (?, ?, ?, ?, ?)";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
			//pstatement.setString(1, Integer.toString(id)); not needed since we update automatically the group id
			pstatement.setString(1, title);
			pstatement.setString(2, creation_date.toString());
			pstatement.setString(3, Integer.toString(duration));
			pstatement.setString(4, Integer.toString(min_participants));
			pstatement.setString(5, Integer.toString(max_participants));
			
			pstatement.executeUpdate();
			ResultSet generatedKeys = pstatement.getGeneratedKeys();
			if (generatedKeys.next()) {
				int groupId = generatedKeys.getInt(1);
				return groupId;
			}
		}
		return -1;
	}
	
	// the 2 following methods filter the database for still active groups
	public ArrayList<Group> getCreatedByUser(int user_id) throws SQLException, ParseException {
		String query = "SELECT * FROM created c JOIN `group` g ON (c.group_id = g.id) WHERE user_id = ? AND DATE_ADD(creation_date, INTERVAL duration DAY) >= CURDATE()";
		return getGroups(query, user_id);
	}

	public ArrayList<Group> getContainsUser(int user_id) throws SQLException, ParseException {
		String query = "SELECT * FROM contains c JOIN `group` g ON (c.group_id = g.id) WHERE user_id = ? AND DATE_ADD(creation_date, INTERVAL duration DAY) >= CURDATE()";
		return getGroups(query, user_id);
	}

	// create Group object from DB response
	private Group getGroupFromResult(ResultSet result) throws SQLException, ParseException {
		int group_id = Integer.parseInt(result.getString("id"));
		String group_title = result.getString("title");
		String creation_date = result.getString("creation_date");
		int group_duration = Integer.parseInt(result.getString("duration"));
		int group_min_participants = Integer.parseInt(result.getString("min_participants"));
		int group_max_participants = Integer.parseInt(result.getString("max_participants"));

		// parse the string to get sql Date object
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
		java.util.Date date = sdf.parse(creation_date);
		Date group_creation_date = new Date(date.getTime());

		Group group = new Group(group_id, group_title, group_creation_date, group_duration, group_min_participants,
				group_max_participants);
		return group;
	}

	private ArrayList<Group> getGroups(String query, int user_id) throws SQLException, ParseException {
		ArrayList<Group> groups = new ArrayList<>();

		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(user_id));

			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst())
					return null;
				else {
					while (result.next()) {
						Group group = getGroupFromResult(result);
						groups.add(group);
					}
					return groups;
				}
			}
		}
	}

}
