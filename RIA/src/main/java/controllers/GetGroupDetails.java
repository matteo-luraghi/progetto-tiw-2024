package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import utils.ConnectionHandler;
import beans.User;
import beans.Group;
import dao.GroupDAO;
import dao.UserDAO;

@WebServlet("/GetGroup")
public class GetGroupDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetGroupDetails() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
		
		try {
			groupId = Integer.parseInt(request.getParameter("groupId"));
		} catch (NumberFormatException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Invalid group id");
			return;
		}
		
		GroupDAO gDao = new GroupDAO(connection);
		Group group = null;
		
		try {
			group = gDao.getGroup(groupId);
		} catch (SQLException | ParseException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to get group's details");
			return;
		}

		// check if the user asking for the details is in the group
		UserDAO uDao = new UserDAO(connection);
		ArrayList<User> participants = null;
		try {
			participants = uDao.getGroupParticipants(groupId);
			if (participants != null) {
				participants.add(uDao.getCreator(groupId));
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to get group's details");
			return;
		}

		Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		if (group != null && participants.contains(u)) {
			String group_json = gson.toJson(group);
			response.getWriter().write(group_json);	
		} else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Invalid group id");	
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}