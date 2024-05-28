package controllers;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.stream.Collectors;

import dao.RelationshipsDAO;
import dao.UserDAO;
import dao.GroupDAO;
import beans.User;
import beans.Group;
import utils.ConnectionHandler;

@WebServlet("/RemoveUser")
public class RemoveUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public RemoveUser() {
        super();
    }

    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath() + "/index.html";
		User u = null;
		HttpSession s = request.getSession();
		if (s.isNew() || s.getAttribute("user") == null) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.getWriter().println("User not logged in");
			return;
		} else {
			u = (User) s.getAttribute("user");
		}	
		
		Integer groupId = null;
		Integer userId = null;
		try {
			groupId = Integer.parseInt(request.getParameter("groupId"));
			userId = Integer.parseInt(request.getParameter("userId"));
			
			if (groupId == null || groupId <= 0 || userId == null || userId <= 0) {
				throw new Exception("Invalid group id");
			}
		} catch (Exception e) { // catch also NumberFormatException
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect or missing param values");
			return;
		}
		
		RelationshipsDAO relDao = new RelationshipsDAO(connection);
		UserDAO uDao = new UserDAO(connection);
		GroupDAO gDao = new GroupDAO(connection);
		Group group = null;
		ArrayList<User> participants = new ArrayList<>();
		User creator = null;
		
		try {
			group = gDao.getGroup(groupId);
			participants = uDao.getGroupParticipants(groupId);
			creator = uDao.getCreator(groupId);
		} catch (SQLException | ParseException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to get group");
			return;
		}

		// prevents from removing the group creator
		if (creator.getId() == userId) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("Can't remove the group creator");
			return;
		}

		// check if the user is in the group participants
		ArrayList<Integer> participants_ids = (ArrayList<Integer>) participants.stream().parallel().map(user -> user.getId()).collect(Collectors.toList());
		if (!participants_ids.contains(userId)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("User not present in group");
			return;
		}
		
		// check if the minimum number of participants is still satisfied
		if (participants.size() != -1 && participants.size() - 1 < group.getMinParticipants()) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("Too few participants would remain");
			return;		
		}
		
		try {
			// check if the user is the group creator
			if (creator.equals(u)) {
				relDao.removeUser(userId, groupId);
			} else {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().println("You're not allowed to perform this action");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Error removing the user from the database");
			return;
		}
		
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
