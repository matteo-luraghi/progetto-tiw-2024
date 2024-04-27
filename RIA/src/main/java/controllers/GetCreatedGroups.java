package controllers;

import java.util.ArrayList;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.io.IOException;
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

@WebServlet("/GetCreatedGroups")
public class GetCreatedGroups extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public GetCreatedGroups() {
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
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}

		GroupDAO gDao = new GroupDAO(connection);
		ArrayList<Group> createdGroups = new ArrayList<>();

		try {
			createdGroups = gDao.getCreatedByUser(u.getId());
		} catch (SQLException | ParseException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover groups");
			return;
		}
		
		Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String createdGroups_json = gson.toJson(createdGroups);
		response.getWriter().write(createdGroups_json);

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
