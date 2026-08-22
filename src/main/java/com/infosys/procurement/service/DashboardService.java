package com.infosys.procurement.service;

import com.infosys.procurement.dto.DashboardCountResponse;

public interface DashboardService {

    DashboardCountResponse getCounts(Long userId);

}